
import { Action } from 'redux'
import Category from 'types/Category'

export const type = 'CLEAR_ALL'

export type ClearAllAction = Action

export default (): ClearAllAction => ({
  type,
})
