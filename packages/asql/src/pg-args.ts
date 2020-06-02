export function createPgArgs() {
  const args: BindVariable[] = []
  let index = 1

  return {
    add(value: BindVariable = null): string {
      args.push(value)
      return `$${index++}`
    },
    args(): BindVariable[] | undefined {
      if (args.length > 0) {
        return args
      }
    },
  }
}

export type BindVariable = number | string | null

