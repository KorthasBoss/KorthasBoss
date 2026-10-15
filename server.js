import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(__dirname, 'players.db');
fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));
app.use(express.static(__dirname, { extensions: ['html'] }));

// SQLite is built into Node 22+, so no native npm module is needed.
// Keep the database next to server.js so it survives normal restarts.
const db = new DatabaseSync(DB_FILE);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS yen_accounts (
    username_key TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    dox INTEGER NOT NULL DEFAULT 500000,
    defeated_json TEXT NOT NULL DEFAULT '{}',
    owned_skills_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL
  );
`);

const selectAccount = db.prepare('SELECT * FROM yen_accounts WHERE username_key = ?');
const insertAccount = db.prepare(`INSERT INTO yen_accounts
  (username_key, username, password_hash, dox, defeated_json, owned_skills_json, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)`);
const updateAccount = db.prepare(`UPDATE yen_accounts SET dox = ?, defeated_json = ?, owned_skills_json = ?
  WHERE username_key = ?`);
const sessions = new Map();
const normalize = value => String(value ?? '').trim().toLowerCase();
const safeAccount = row => ({
  username: row.username,
  dox: row.dox,
  defeated: parseJson(row.defeated_json, {}),
  ownedSkills: parseJson(row.owned_skills_json, []),
  createdAt: row.created_at
});
function parseJson(value, fallback) { try { return JSON.parse(value); } catch { return fallback; } }
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}
function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || '').split(':');
  if (!salt || !expected || !/^[a-f0-9]{128}$/i.test(expected)) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer);
}
function newToken(usernameKey) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, usernameKey);
  return token;
}
function auth(req, res, next) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const usernameKey = sessions.get(token);
  if (!usernameKey) return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
  const row = selectAccount.get(usernameKey);
  if (!row) { sessions.delete(token); return res.status(401).json({ error: 'Account not found. Please sign in again.' }); }
  req.accountRow = row;
  req.usernameKey = usernameKey;
  next();
}

// One-time, non-destructive migration from the previous JSON account file.
// Existing passwords in this file already use the same salt:hash scrypt format.
const legacyJson = path.join(DATA_DIR, 'accounts.json');
if (fs.existsSync(legacyJson)) {
  try {
    const legacy = JSON.parse(fs.readFileSync(legacyJson, 'utf8'));
    for (const [key, account] of Object.entries(legacy.accounts || {})) {
      if (selectAccount.get(normalize(key))) continue;
      if (!account?.username || !account?.password) continue;
      insertAccount.run(
        normalize(account.username), String(account.username), String(account.password),
        Math.max(0, Math.floor(Number(account.dox) || 0)),
        JSON.stringify(account.defeated || {}), JSON.stringify(Array.isArray(account.ownedSkills) ? account.ownedSkills : []),
        account.createdAt || new Date().toISOString()
      );
    }
  } catch (error) { console.error('Legacy account migration skipped:', error.message); }
}

// Import accounts from the original mini-server's users(username,password,points) table,
// if that table exists. Passwords are hashed during import; the old table is left untouched.
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").all();
  if (tables.length) {
    const columns = db.prepare('PRAGMA table_info(users)').all().map(c => c.name);
    if (columns.includes('username') && columns.includes('password')) {
      const rows = db.prepare('SELECT * FROM users').all();
      for (const old of rows) {
        const key = normalize(old.username);
        if (!key || selectAccount.get(key)) continue;
        const oldPassword = String(old.password || '');
        const storedHash = /^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(oldPassword) ? oldPassword : hashPassword(oldPassword);
        insertAccount.run(key, String(old.username), storedHash, Math.max(0, Math.floor(Number(old.points) || 0)), '{}', '[]', new Date().toISOString());
      }
    }
  }
} catch (error) { console.error('Old mini-server account migration skipped:', error.message); }

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'YEN! mini server', storage: 'SQLite', database: path.basename(DB_FILE) }));

app.post('/api/register', (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  const key = normalize(username);
  if (!/^[A-Za-z0-9_-]{3,24}$/.test(username)) return res.status(400).json({ error: 'Username must be 3–24 letters, numbers, underscores or hyphens.' });
  if (password.length < 6 || password.length > 128) return res.status(400).json({ error: 'Password must be 6–128 characters.' });
  if (selectAccount.get(key)) return res.status(409).json({ error: 'That username already exists.' });
  const createdAt = new Date().toISOString();
  try {
    insertAccount.run(key, username, hashPassword(password), 500000, '{}', '[]', createdAt);
    const account = selectAccount.get(key);
    return res.status(201).json({ token: newToken(key), account: safeAccount(account) });
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) return res.status(409).json({ error: 'That username already exists.' });
    console.error('Register failed:', error);
    return res.status(500).json({ error: 'Could not create the account. Please try again.' });
  }
});

app.post('/api/login', (req, res) => {
  const key = normalize(req.body?.username);
  const password = String(req.body?.password || '');
  const account = selectAccount.get(key);
  if (!account || !verifyPassword(password, account.password_hash)) return res.status(401).json({ error: 'Invalid username or password.' });
  return res.json({ token: newToken(key), account: safeAccount(account) });
});

app.get('/api/me', auth, (req, res) => res.json({ account: safeAccount(req.accountRow) }));

app.post('/api/save', auth, (req, res) => {
  const body = req.body || {};
  const dox = Number.isFinite(body.dox) ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(body.dox))) : req.accountRow.dox;
  const defeated = body.defeated && typeof body.defeated === 'object' && !Array.isArray(body.defeated) ? body.defeated : parseJson(req.accountRow.defeated_json, {});
  const ownedSkills = Array.isArray(body.ownedSkills)
    ? [...new Set(body.ownedSkills.filter(v => typeof v === 'string').map(v => v.slice(0, 120)))].slice(0, 5000)
    : parseJson(req.accountRow.owned_skills_json, []);
  try {
    updateAccount.run(dox, JSON.stringify(defeated), JSON.stringify(ownedSkills), req.usernameKey);
    return res.json({ account: safeAccount(selectAccount.get(req.usernameKey)) });
  } catch (error) {
    console.error('Save failed:', error);
    return res.status(500).json({ error: 'Your progress could not be saved. Keep the server running and try again.' });
  }
});

app.post('/api/logout', (req, res) => {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

app.use((_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || '0.0.0.0';
const server = app.listen(port, host, () => {
  console.log(`YEN! mini server running at http://${host}:${port}`);
  console.log(`SQLite account database: ${DB_FILE}`);
  console.log('Open http://localhost:' + port + ' on this computer.');
});
function shutdown() {
  server.close(() => { try { db.close(); } finally { process.exit(0); } });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
