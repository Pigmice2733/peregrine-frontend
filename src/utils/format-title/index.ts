export const formatTitle = (input: string) =>
  input
    .toLowerCase()
    .replace(/[\s_]+/g, ' ')
    .replace(/\w+/g, str => str[0].toUpperCase() + str.slice(1))
