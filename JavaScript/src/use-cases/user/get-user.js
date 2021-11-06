export default function makeGetUser({ usersDB }) {
    return async function getUser({ query, parameters = {} }) {
        return usersDB.findOne({ query, parameters })
    }
}