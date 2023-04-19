import {$escape, $if, $sql, sql} from './sql'

describe('sql', function () {
  it('should sql', function () {
    const arg = 'string'
    const [text, args] = sql`
    SELECT column_name
    FROM table_name
    WHERE type = ${arg}
`

    expect(args).toHaveLength(1)
  })

  it('should support $if', function () {
    const array = ['a', 'b', 'c', 'd']

    const [text, args] = sql`
select (${array})
${$if(false, $sql`
-- $if false
select * from (${array})`)}
${$if(true, $sql`
-- > $if true
select * from (${array})
${$if(true, $sql`
  -- $if true
  select * from (${array})
${$if(true, $sql`
    -- 111 $if true
    select * from (${array})
    -- $if true end `)}
  -- $if true end `)}
-- < $if true end`)}
`
    expect(args).toHaveLength(array.length * 4)
  })

  it('should support array', function () {
    const array = ['a', 'b', 'c', 'd']
    const [text, args] = sql`category in (${array})`

    expect(text.trim()).toEqual(`category in ($1,$2,$3,$4)`)
    expect(args).toHaveLength(array.length)
  })

  it('should support nested array', function () {
    const values = [
      [1, 1],
      [2, 2],
    ]
    const [text, args] = sql`
    insert into table (element1, element2)
    values (${values})
    returning *

    `
    expect(args).toHaveLength(4)
  })
  it('asql should support escape in nested array', function () {
    const values = [
      ['current_time', $escape('current_timestamp'), 1],
    ]
    const [text, args] = sql`
    insert into table (element1, element2, element2) ${$escape('escape text')}
    values (${values})
    returning *
    `

    expect(args).toHaveLength(2)
    expect(text).toBe(`    insert into table (element1, element2, element2) escape text
    values (($1,current_timestamp,$2))
    returning *
    `)
  })
})