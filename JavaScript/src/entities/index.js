import Id from '../Id'
import buildMakeUser from './user/user'
import buildMakeSystem from './system/system'
import { systemValidator } from './utils'

const makeUser = buildMakeUser({ Id })
const makeSystem = buildMakeSystem({ systemValidator })
export { makeUser, makeSystem }