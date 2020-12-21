export class NullableMinMax {
  constructor(private column: string, private minmax: NullableMinMaxData = {}, private option: NullableMinMaxOption = {}) {
  }

  get(add) {
    const {column, minmax, option} = this
    const {min, max} = minmax
    const {greaterThan = '>=', lessThan = '<=', notNull} = option

    if (min !== undefined) {
      if (max !== undefined) {
        return `(${column} ${greaterThan} ${add(min)} AND ${column} ${lessThan} ${add(max)})`
      } else {
        return `${column} ${greaterThan} ${add(min)}`
      }
    } else {
      if (max !== undefined) {
        if (notNull)  {
          return `${column} ${lessThan} ${add(max)}`
        }
        return `(${column} IS NULL OR ${column} ${lessThan} ${add(max)})`
      }
    }
    return ''
  }
}