import Id from '../Id'
import buildMakeUser from './user/user'
import buildMakeSystem from './system/system'
import { systemValidator, md5 } from './utils'

const makeUser = buildMakeUser({ Id })
const makeSystem = buildMakeSystem({ Id, "validator": systemValidator, md5 })
export { makeUser, makeSystem }