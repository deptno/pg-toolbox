import {BindVariable, createPgArgs} from './pg-args'

export const sql = (clauses: TemplateStringsArray, ...exps: any[]): [string, BindVariable[]] => {
  const pgArgs = createPgArgs()
  const sql = _sql(pgArgs)(clauses, ...exps)

  return [sql, pgArgs.args()]
}
export const $if = (condition: boolean, ...tt: any[]) => {
  if (condition) {
    return () => tt.flat()
  }

  return () => [
    [''],
    [],
  ]
}
export const $sql = (clauses: TemplateStringsArray, ...exps: any[]) => [clauses, exps]
export const $escape = (v) => new Escape(v)

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

      return cc + add(v) + c
    })
    .split('\n')
    .filter(Boolean)
    .join('\n')
}
function _arrayArgs(add, v: any) {
  return v.map(vv => {
    if (Array.isArray(vv)) {
      return '(' + _arrayArgs(add, vv) + ')'
    }
    return add(vv)
  })
}
class Escape {
  constructor(private _data) {
  }

  get() {
    return this._data
  }
}
