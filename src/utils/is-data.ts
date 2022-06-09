/**
 * Returns whether the given input is not an error and is also not undefined
 */
export const isData = <T extends unknown>(
  input: T,
): input is Exclude<T, Error | undefined> =>
  !(input instanceof Error) && input !== undefined
