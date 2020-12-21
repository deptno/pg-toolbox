import {BindVariable, createPgArgs} from './pg-args'
import {Escape, MinMax, NullableMinMax} from './entity'

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
export const minmax = (column: string, v?: NullableMinMaxData, o?: NullableMinMaxOption) => new NullableMinMax(column, v, o)

function _sql({add, args}) {
  return (clauses: TemplateStringsArray, ...exps: any[]): string => clauses
    .reduce((cc, c, i) => {
      const v = exps[i - 1]

      if (typeof v === 'function') {
        const [subClauses, subArgs] = v()

        return cc + _sql({add, args: subArgs})(subClauses, ...subArgs) + c
      }
      if (v instanceof Escape) {
        return cc + v.get() + c
      }
      if (Array.isArray(v)) {
        return cc + _arrayArgs(add, v) + c
      }
      if (v instanceof MinMax) {
        return `${cc}numrange(${v.min},${v.max})`
      }
      if (v instanceof NullableMinMax) {
        return cc + v.get(add)
      }

      return cc + add(v) + c
    })
    .split('\n')
    .filter(Boolean)
    .join('\n')
}
function _arrayArgs(add, v: any) {
  if (v.length > 0) {
    return v.map(vv => {
      if (Array.isArray(vv)) {
        return '(' + _arrayArgs(add, vv) + ')'
      }
      return add(vv)
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
