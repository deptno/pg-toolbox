export class Raw {
  constructor(private _data) {
  }

  get(add) {
    return add(this._data)
  }
}