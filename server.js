import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'accounts.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ accounts: {} }, null, 2));

const app = express();
app.use(express.json({ limit: '64kb' }));
app.use(express.static(__dirname));

const sessions = new Map();
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = db => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
const normalize = name => String(name || '').trim().toLowerCase();
const safeAccount = a => ({ username: a.username, dox: a.dox, defeated: a.defeated || {}, ownedSkills: a.ownedSkills || [], createdAt: a.createdAt });
const hashPassword = password => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};
const verifyPassword = (password, stored) => {
  const [salt, expected] = String(stored).split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
};
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const username = token && sessions.get(token);
  if (!username) return res.status(401).json({ error: 'Sign in required.' });
  const db = readDB();
  const account = db.accounts[username];
  if (!account) return res.status(401).json({ error: 'Account not found.' });
  req.account = account; req.username = username; req.db = db;
  next();
};

app.post('/api/register', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const key = normalize(username);
  if (!/^[A-Za-z0-9_\-]{3,24}$/.test(username)) return res.status(400).json({ error: 'Username must be 3-24 letters, numbers, _ or -.' });
  if (password.length < 6 || password.length > 72) return res.status(400).json({ error: 'Password must be 6-72 characters.' });
  const db = readDB();
  if (db.accounts[key]) return res.status(409).json({ error: 'That username already exists.' });
  db.accounts[key] = { username, password: hashPassword(password), dox: 500000, defeated: {}, ownedSkills: [], createdAt: new Date().toISOString() };
  writeDB(db);
  const token = crypto.randomBytes(32).toString('hex'); sessions.set(token, key);
  res.json({ token, account: safeAccount(db.accounts[key]) });
});

app.post('/api/login', (req, res) => {
  const key = normalize(req.body.username);
  const password = String(req.body.password || '');
  const db = readDB(); const account = db.accounts[key];
  if (!account || !verifyPassword(password, account.password)) return res.status(401).json({ error: 'Invalid username or password.' });
  const token = crypto.randomBytes(32).toString('hex'); sessions.set(token, key);
  res.json({ token, account: safeAccount(account) });
});

app.get('/api/me', auth, (req, res) => res.json({ account: safeAccount(req.account) }));

app.post('/api/save', auth, (req, res) => {
  const body = req.body || {};
  if (Number.isFinite(body.dox)) req.account.dox = Math.max(0, Math.floor(body.dox));
  if (body.defeated && typeof body.defeated === 'object') req.account.defeated = body.defeated;
  if (Array.isArray(body.ownedSkills)) req.account.ownedSkills = [...new Set(body.ownedSkills.map(String))].slice(0, 5000);
  req.db.accounts[req.username] = req.account; writeDB(req.db);
  res.json({ account: safeAccount(req.account) });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (token) sessions.delete(token);
  res.json({ ok: true });
});

app.use((req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`YEN! Boss World listening on ${port}`));
