import {BindVariable, createPgArgs} from './pg-args'
import {Escape, MinMax, NullableMinMax, Raw} from './entity'

export const sql = (clauses: TemplateStringsArray, ...exps: any[]): [string, BindVariable[]] => {
  const pgArgs = createPgArgs()
  const sql = _sql(pgArgs)(clauses, ...exps)

  return [sql, pgArgs.args()]
}
export const $if = (condition: unknown, ...tt: any[]) => {
  const flat = () => tt.flat()

  if (Array.isArray(condition)) {
    return flat
  } else if (condition) {
    return flat
  }

  return () => [
    [''],
    [],
  ]
}
export const $sql = (clauses: TemplateStringsArray, ...exps: any[]) => [clauses, exps]
export const $escape = (v) => new Escape(v)
export const $raw = (v) => new Raw(v)
export const minmax = (column: string, v?: NullableMinMaxData, o?: NullableMinMaxOption) => new NullableMinMax(column, v, o)

function _sql({add, args}) {
  return (clauses: TemplateStringsArray, ...exps: any[]): string => clauses
    .reduce((cc, c, i) => cc + _arg(add, exps[i - 1], c))
    .split('\n')
    .filter(Boolean)
    .join('\n')
}
function _arg(add, v: any, c = '') {
  console.log({v, c})
  if (Array.isArray(v)) {
    return _arrayArgs(add, v) + c
  }
  if (typeof v === 'function') {
    const [subClauses, subArgs] = v()

    return _sql({add, args: subArgs})(subClauses, ...subArgs) + c
  }
  if (v instanceof Escape) {
    return v.get() + c
  }
  if (v instanceof Raw) {
    return v.get(add) + c
  }
  if (v instanceof MinMax) {
    return `numrange(${v.min},${v.max})`
  }
  if (v instanceof NullableMinMax) {
    return v.get(add)
  }

  return add(v) + c
}
function _arrayArgs(add, v: any) {
  if (v.length > 0) {
    return v.map(vv => {
      if (Array.isArray(vv)) {
        return '(' + _arrayArgs(add, vv) + ')'
      }
      return _arg(add, vv)
    })
  } else {
    return 'NULL'
  }
}

type NullableMinMaxData = {
  min?: Number
  max?: Number
}
type NullableMinMaxOption = {
  greaterThan?: GreaterThanOperator
  lessThan?: LessThanOperator
  notNull?: boolean
}
type GreaterThanOperator = '>' | '>='
type LessThanOperator = '<' | '<='
