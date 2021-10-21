export default function makeAddUser({ usersDB, makeUser }) {
    return async function addUser(userInfo) {

        const user = makeUser(userInfo);
        return usersDB.insert({
            author: user.getAuthor(),
            createdOn: user.getCreatedOn(),
            modifiedOn: user.getModifiedOn(),
            id: user.getId()
        })
    }
}