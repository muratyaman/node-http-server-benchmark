# node-http-server-benchmark

Comparison of performance - requests per second - using Node HTTP server, text, JSON, PostgreSQL query results.

## Requirements

* For HTTP service:
  * [Node](https://nodejs.org/)

* For calling HTTP service:
  * [Node](https://nodejs.org/)
  * [autocannon](https://www.npmjs.com/package/autocannon)

## Installation

```sh
npm i
```

## Configuration

Copy `.env.example` as `.env` and review the settings.

## Execution

Terminal 1:

```sh
npm run start
```

Terminal 2:

```sh
autocannon http://localhost:8000/
autocannon http://localhost:8000/json
autocannon http://localhost:8000/sql1
autocannon http://localhost:8000/sql2
```

## Summary

Average Req/Sec:

| Text | JSON | PgSQL 1 | PgSQL 2 |
| - | - | - | - |
| 88k | 71k | 28k | 0.2k |

## Results for Hello world - Text output

Send fixed/same text all the time 'Hello world'.

```
Running 10s test @ http://127.0.0.1:8000
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max  │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0.01 ms │ 0.03 ms │ 9 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴──────┘
┌───────────┬─────────┬─────────┬───────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%   │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼───────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 79359   │ 79359   │ 89471 │ 91583   │ 88928   │ 3211.97 │ 79340   │
├───────────┼─────────┼─────────┼───────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 14.2 MB │ 14.2 MB │ 16 MB │ 16.4 MB │ 15.9 MB │ 575 kB  │ 14.2 MB │
└───────────┴─────────┴─────────┴───────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

978k requests in 11.01s, 175 MB read
```

## Results for simple JSON message

Send JSON string for object:

```javascript
const body = { message: "Hello world", ts: new Date() };
```

```
Running 10s test @ http://127.0.0.1:8000/json
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬──────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max  │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼──────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0.01 ms │ 0.03 ms │ 7 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴──────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Req/Sec   │ 65727   │ 65727   │ 71551   │ 72127   │ 70938.19 │ 1712.84 │ 65695   │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Bytes/Sec │ 15.2 MB │ 15.2 MB │ 16.6 MB │ 16.7 MB │ 16.5 MB  │ 398 kB  │ 15.2 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

780k requests in 11.01s, 181 MB read
```

## Results for getting time from PostgreSQL v1

Send result of query:

```sql
SELECT now() AS ts;
```

```
Running 10s test @ http://127.0.0.1:8000/sql1
10 connections

┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 0 ms │ 0 ms │ 0 ms  │ 0 ms │ 0.01 ms │ 0.18 ms │ 38 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Req/Sec   │ 24495   │ 24495   │ 28703   │ 29087   │ 28339.64 │ 1233.75 │ 24480   │
├───────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┼─────────┤
│ Bytes/Sec │ 7.79 MB │ 7.79 MB │ 9.13 MB │ 9.25 MB │ 9.01 MB  │ 393 kB  │ 7.78 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

312k requests in 11.01s, 99.1 MB read
```

## Results for random list of records from PostgreSQL v2

Send result of query:

```sql
SELECT id, full_name, email FROM users LIMIT 10 OFFSET $offset;
```

Offset is randomly chosen between 0 and the rough number of records.

```
Running 10s test @ http://127.0.0.1:8000/sql2
10 connections

┌─────────┬──────┬───────┬───────┬────────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5% │ 50%   │ 97.5% │ 99%    │ Avg      │ Stdev    │ Max    │
├─────────┼──────┼───────┼───────┼────────┼──────────┼──────────┼────────┤
│ Latency │ 2 ms │ 41 ms │ 95 ms │ 114 ms │ 43.03 ms │ 29.31 ms │ 179 ms │
└─────────┴──────┴───────┴───────┴────────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Req/Sec   │ 162    │ 162    │ 238    │ 251    │ 229.3  │ 26.55   │ 162    │
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤
│ Bytes/Sec │ 188 kB │ 188 kB │ 276 kB │ 292 kB │ 266 kB │ 30.8 kB │ 188 kB │
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

2k requests in 10.02s, 2.66 MB read
```
