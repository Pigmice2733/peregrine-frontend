export const parseDateProps = <
  T extends { [key: string]: unknown },
  S extends string
>(
  input: T,
  dateKeys: S[],
) => {
  const output = {} as { [K in keyof T]: K extends S ? Date : T[K] }
  for (const k in input) {
    const v = input[k]
    output[k] = ((dateKeys as string[]).includes(k) && typeof v === 'string'
      ? new Date(v)
      : v) as Extract<keyof T, string> extends S
      ? Date
      : T[Extract<keyof T, string>]
  }
  return output
}
