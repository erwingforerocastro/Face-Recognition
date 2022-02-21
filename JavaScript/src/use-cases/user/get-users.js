export default function makeGetUsers({ usersDB }) {
    return async function getUsers({ query, parameters = {} } = {}) {
        return await usersDB.findAll({ query, parameters })
    }
}