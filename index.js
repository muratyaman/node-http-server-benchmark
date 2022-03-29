require('dotenv').config();
const { createServer } = require('http');
const { Pool } = require('pg');

const penv = process.env;
const config = makeConfig(penv);

const SELECT_PROFILES = 'SELECT id, name, email FROM public.profile LIMIT 10 OFFSET $1';

const dbPool = new Pool(config.db);
const server = createServer(handler);

server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(config.http.port);

async function handler(req, res) {
  let response = '';
  switch (req.url) {
    case '/json': response = await json(req, res); break;
    case '/sql1': response = await sql1(req, res); break;
    case '/sql2': response = await sql2(req, res); break;
    case '/text':
    case '/':
    default:
      response = await text(req, res);
  }
  res.writeHead(200);
  res.end(response);
}

async function text(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  return 'hello world!';
}

async function json(req, res) {
  res.setHeader('Content-Type', 'application/json');
  return JSON.stringify({ message: 'Hello world!', ts: new Date() });
}

async function sql1(req, res) {
  let error = null, data = null;
  try {
    const result = await dbQuery('SELECT now() AS ts', [], 'time');
    data = result.data;
    error = result.error;
  } catch (err) {
    error = err.message;
  }
  const result = {
    message: 'Hello, World!',
    method: req.method,
    url: req.url,
    data,
    error,
    ts: new Date(),
  };
  res.setHeader('Content-Type', 'application/json');
  return JSON.stringify(result);
}

async function sql2(req, res) {
  let error = null, data = null;
  try {
    const offset = 0 + Math.floor(Math.random() * 200000);
    const result = await dbQuery(SELECT_PROFILES, [offset], 'users-page');
    data = result.data;
    error = result.error;
  } catch (err) {
    error = err.message;
  }
  const result = {
    message: 'Hello, World!',
    method: req.method,
    url: req.url,
    data,
    error,
    ts: new Date(),
  };
  res.setHeader('Content-Type', 'application/json');
  return JSON.stringify(result);
}

async function dbQuery(text, values = [], name = null) {
  let data = null, error = null;
  try {
    const db = await dbPool.connect();
    try {
      const result = await db.query({ text, values, name });
      data = result.rows;
    } catch (err) {
      console.error('db query error', err.message);
    }
    db.release();
  } catch (err) {
    console.error('db connection error', err.message);
  }
  return { data, error };
}

function makeConfig(penv) {
  const conf = {
    http: {
      port: Number.parseInt(penv.HTTP_PORT ?? '8000'),
    },
    db: {
      host:     penv.PGHOST ?? 'localhost',
      port:     Number.parseInt(penv.PGPORT ?? '5432'),
      user:     penv.PGUSER ?? '',
      password: penv.PGPASSWORD ?? '',
      database: penv.PGDATABASE ?? '',
      max:      100, // maximum number of clients the pool should contain
    },
  };
  return conf;
}
