# asql
[![npm](https://img.shields.io/npm/dt/asql.svg?style=for-the-badge)](https://www.npmjs.com/package/asql)

generate postgresql query using tagged template literals

## install
```shell
npm install asql
```

## api
- sql
- $sql
- $if
- $escape
- minmax

## usage
```ts
import {Client} from 'pg'
import {sql} from 'asql'

const client = new Client()
await client.connect()

const condition = true
const [query, args] = sql`
SELECT
  *
FROM
  table
`

const result = client.query(query, args)

await client.end()
```

### insert single rows
```ts
const row = [1,2,3]
const [query, args] = sql`
INSERT INTO
  table
VALUES
  ${row}
`
```

### insert multiple rows
```ts
const rows = [
    [1,2,3],
    [2,3,4]
]
const [query, args] = sql`
INSERT INTO
  table
VALUES
  ${rows}
`
```
### escape variable
```ts
import {$escape} from "./sql";

const [query, args] = sql`
SELECT
  *
FROM
  table
LIMIT
  ${$escape(10)}
OFFSET
  ${$escape(20)}
`
```
### condition
```ts
const condition = true
const [query, args] = sql`
SELECT
  t1.*
  ${$if(condition, $sql`, t2.*`)}
FROM
  table as t1
  ${$if(condition, $sql`LEFT JOIN table2 as t2 on ...`)}
`
```
### where
```ts
const [query, args] = sql`
SELECT
  *
FROM
  table
  ${$if(condition, $sql`
    LEFT JOIN table2 ...
  `)}
WHERE
  num_column = ${1}
  , str_column = ${'a'}
  , num_array_column IN (${[1,2,3]})
`
```
### minmax
```ts
const value = {
  min: 1,
  max: 5,
}
const [query, args] = sql`
SELECT
  *
FROM
  table
WHERE
  ${$if(maxAskPrice, $sql`${minmax('min_max_column', value)}`)} -- (min_max_column >= 1 AND min_max_column <= 5)
`
```
### minmax2
```ts
const value = {
  min: 1,
  max: 5,
}
const option = {
    greaterThan: '>', // default >=
    lessThan: '<', // default <=
    notNull: true, // default false, undefined value will replace with `COLUMN_NAME IS NULL OR`
}
const [query, args] = sql`
SELECT
  *
FROM
  table
WHERE
  ${$if(maxAskPrice, $sql`${minmax('min_max_column', value)}`)} -- (min_max_column >= 1 AND min_max_column <= 5)
`
```

## license
MIT