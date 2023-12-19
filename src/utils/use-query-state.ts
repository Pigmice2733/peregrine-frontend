import { Val as URLVal } from 'qss'
import { useQueryParam, updateQueryParam } from '@/url-manager'

export const useQueryState = <DefaultVal extends URLVal = undefined>(
  name: string,
  initialState?: DefaultVal,
) => {
  const val = useQueryParam(name)

  return [
    val ?? initialState,
    (newValue: URLVal) => {
      updateQueryParam(name, newValue)
    },
  ] as const
}
