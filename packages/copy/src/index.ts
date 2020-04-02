import {ParseOne} from 'unzipper'
import {Client} from 'pg'
import {from} from 'pg-copy-streams'

const [,, tableName] = process.argv
const label = 'copy'
const client = new Client()

client.connect()
  .then(_ => console.time(label))
  .then(() => new Promise((resolve, reject) => {
    const sql = `copy real_estate.${tableName} from stdin with encoding 'euc-kr' delimiter '|' csv`
    const database = client.query(from(sql))

    process.stdin
      .pipe(ParseOne())
      .pipe(
        database
          .on('error', reject)
          .on('end', resolve),
      )
  }))
  .catch(console.error)
  .then(() => client.end())
  .finally(() => console.timeEnd(label))
