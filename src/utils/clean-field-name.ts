/* eslint-disable no-warning-comments */
// TODO: Remove once we can handle multiple fields of the same name
export const cleanFieldName = (fieldName: string) =>
  fieldName.replace(/\((?:auto|teleop)\)/, '').trim()
