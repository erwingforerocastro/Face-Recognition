export default function makeGetUsers({ usersDB }) {
    return async function getUsers({ query, parameters = {} } = {}) {
        return usersDB.findAll({ query, parameters })
    }
}