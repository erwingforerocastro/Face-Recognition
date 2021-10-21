// entities
import {
    makeSystem,
    makeUser
} from "../../entities";
// data access
import {
    systemsDB,
    UserDB
} from "../data-access/index"

// same layer
//system
import makeAddSystem from "./system/add-system";
import makeUpdateSystem from "./system/update-system";
import makeDeleteSystem from "./system/delete-system";
import MakeGetSystem from "./system/get-system";
//user
import makeAddUser from "./user/add-user";
import makeGetUsers from "./user/get-users";


// System
const addSystem = makeAddSystem({ systemsDB, makeSystem })
const updateSystem = makeUpdateSystem({ systemsDB, makeSystem })
const deleteSystem = makeDeleteSystem({ systemsDB })
const getSystem = MakeGetSystem({ systemsDB })

// User
const addUser = makeAddUser({ UserDB, makeUser })
const getUsers = makeGetUsers({ UserDB })
export {
    addSystem,
    updateSystem,
    getSystem,
    deleteSystem,
    addUser,
    getUsers
}