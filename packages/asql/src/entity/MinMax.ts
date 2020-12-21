export class MinMax {
  public min: number
  public max: number

  constructor(tuple: string) {
    if (tuple === 'empty') {
      this.min = null
      this.max = null
    } else {
      const [min, max] = tuple
        .slice(1, -1)
        .split(',')
        .map<number|null>(normalize)
      this.min = min
      this.max = max
    }
  }
}

const normalize = (d) => {
  if (typeof d !== 'number') {
    return null
  }
  return Number(d)
}