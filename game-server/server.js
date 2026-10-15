// YEN! MINI SERVER
// No extra database package is required.
// Works with Node.js 18+ and saves accounts to data/accounts.json.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const ACCOUNT_FILE = path.join(DATA_DIR, 'accounts.json');
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

fs.mkdirSync(DATA_DIR, { recursive: true });

function readAccounts() {
  if (!fs.existsSync(ACCOUNT_FILE)) return { accounts: {} };
  try {
    const data = JSON.parse(fs.readFileSync(ACCOUNT_FILE, 'utf8'));
    if (!data || typeof data !== 'object' || !data.accounts || typeof data.accounts !== 'object') {
      return { accounts: {} };
    }
    return data;
  } catch (error) {
    console.error('Could not read accounts.json:', error.message);
    return { accounts: {} };
  }
}

let store = readAccounts();

function saveAccounts() {
  const temp = ACCOUNT_FILE + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(store, null, 2), 'utf8');
  // Windows can have trouble replacing an existing file with rename().
  // Remove the old file only after the temporary file was written successfully.
  try { fs.rmSync(ACCOUNT_FILE, { force: true }); } catch {}
  fs.renameSync(temp, ACCOUNT_FILE);
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function parseJson(value, fallback) {
  try { return JSON.parse(value); } catch { return fallback; }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const parts = String(stored || '').split(':');
  if (parts.length !== 2) return false;
  const salt = parts[0];
  const expectedHex = parts[1];
  if (!/^[a-f0-9]{32}$/i.test(salt) || !/^[a-f0-9]{128}$/i.test(expectedHex)) return false;
  try {
    const actual = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function safeAccount(account) {
  return {
    username: account.username,
    dox: Number.isFinite(Number(account.dox)) ? Math.max(0, Math.floor(Number(account.dox))) : 0,
    defeated: account.defeated && typeof account.defeated === 'object' ? account.defeated : {},
    ownedSkills: Array.isArray(account.ownedSkills) ? account.ownedSkills : [],
    createdAt: account.createdAt || null
  };
}

// The old mini server used username/password/points. If an older account
// exists, convert its points into YEN!'s DOX value without deleting anything.
for (const account of Object.values(store.accounts)) {
  if (!account || typeof account !== 'object') continue;
  if (account.dox == null && account.points != null) account.dox = Number(account.points) || 0;
  if (!account.defeated || typeof account.defeated !== 'object') account.defeated = {};
  if (!Array.isArray(account.ownedSkills)) account.ownedSkills = [];
  if (!account.createdAt) account.createdAt = new Date().toISOString();
}
saveAccounts();

const sessions = new Map();

function createSession(usernameKey) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, usernameKey);
  return token;
}

function getAuthAccount(req) {
  const header = String(req.headers.authorization || '');
  const token = header.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const key = sessions.get(token);
  if (!key || !store.accounts[key]) return null;
  return { token, key, account: store.accounts[key] };
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendText(res, status, text, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Content-Length': Buffer.byteLength(text) });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (Buffer.byteLength(raw) > 64 * 1024) {
        reject(new Error('Request too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function serveFile(req, res, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); }
  catch { return sendText(res, 400, 'Bad request'); }

  if (decoded.includes('\0')) return sendText(res, 400, 'Bad request');
  if (decoded === '/') decoded = '/index.html';

  const requested = path.resolve(ROOT, '.' + decoded);
  if (requested !== ROOT && !requested.startsWith(ROOT + path.sep)) {
    return sendText(res, 403, 'Forbidden');
  }

  fs.stat(requested, (err, stat) => {
    if (!err && stat.isFile()) {
      const type = MIME[path.extname(requested).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
      fs.createReadStream(requested).pipe(res);
      return;
    }
    // YEN! is a normal static game, so unknown browser routes fall back to index.
    const index = path.join(ROOT, 'index.html');
    fs.stat(index, (indexErr) => {
      if (indexErr) return sendText(res, 404, 'YEN! index.html was not found.');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
      fs.createReadStream(index).pipe(res);
    });
  });
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, service: 'YEN! mini server', storage: 'JSON file', database: 'data/accounts.json' });
  }

  let body = {};
  if (req.method === 'POST') {
    try { body = await readBody(req); }
    catch (error) { return sendJson(res, 400, { error: error.message }); }
  }

  if (req.method === 'POST' && pathname === '/api/register') {
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    const key = normalize(username);
    if (!/^[A-Za-z0-9_-]{3,24}$/.test(username)) {
      return sendJson(res, 400, { error: 'Username must be 3–24 letters, numbers, underscores or hyphens.' });
    }
    if (password.length < 6 || password.length > 128) {
      return sendJson(res, 400, { error: 'Password must be 6–128 characters.' });
    }
    if (store.accounts[key]) return sendJson(res, 409, { error: 'That username already exists.' });

    store.accounts[key] = {
      username,
      password: hashPassword(password),
      dox: 500000,
      defeated: {},
      ownedSkills: [],
      createdAt: new Date().toISOString()
    };
    try { saveAccounts(); }
    catch (error) {
      delete store.accounts[key];
      console.error('Register save failed:', error);
      return sendJson(res, 500, { error: 'Could not save the account. Check that the server folder is writable.' });
    }

    return sendJson(res, 201, { token: createSession(key), account: safeAccount(store.accounts[key]) });
  }

  if (req.method === 'POST' && pathname === '/api/login') {
    const key = normalize(body.username);
    const password = String(body.password || '');
    const account = store.accounts[key];
    if (!account || !verifyPassword(password, account.password)) {
      return sendJson(res, 401, { error: 'Invalid username or password.' });
    }
    return sendJson(res, 200, { token: createSession(key), account: safeAccount(account) });
  }

  const auth = getAuthAccount(req);
  if (!auth) return sendJson(res, 401, { error: 'Your session expired. Please sign in again.' });

  if (req.method === 'GET' && pathname === '/api/me') {
    return sendJson(res, 200, { account: safeAccount(auth.account) });
  }

  if (req.method === 'POST' && pathname === '/api/save') {
    if (Number.isFinite(body.dox)) {
      auth.account.dox = Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(Number(body.dox))));
    }
    if (body.defeated && typeof body.defeated === 'object' && !Array.isArray(body.defeated)) {
      auth.account.defeated = body.defeated;
    }
    if (Array.isArray(body.ownedSkills)) {
      auth.account.ownedSkills = [...new Set(body.ownedSkills
        .filter(v => typeof v === 'string')
        .map(v => v.slice(0, 120)))].slice(0, 5000);
    }

    try { saveAccounts(); }
    catch (error) {
      console.error('Save failed:', error);
      return sendJson(res, 500, { error: 'Your progress could not be saved. Check that the server folder is writable.' });
    }
    return sendJson(res, 200, { account: safeAccount(auth.account) });
  }

  if (req.method === 'POST' && pathname === '/api/logout') {
    sessions.delete(auth.token);
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 404, { error: 'API route not found.' });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    if (pathname.startsWith('/api/')) return await handleApi(req, res, pathname);
    if (req.method !== 'GET' && req.method !== 'HEAD') return sendText(res, 405, 'Method not allowed');
    return serveFile(req, res, pathname);
  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) sendJson(res, 500, { error: 'Internal server error.' });
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('====================================');
  console.log('        YEN! MINI SERVER ONLINE');
  console.log('====================================');
  console.log(`Open YEN! here: http://localhost:${PORT}`);
  console.log(`Saves are stored here: ${ACCOUNT_FILE}`);
  console.log('Keep this window open while playing.');
  console.log('Press Ctrl+C to stop the server.');
  console.log('====================================');
  console.log('');
});

function shutdown() {
  console.log('\nStopping YEN! mini server...');
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
