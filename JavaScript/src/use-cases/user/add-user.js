export default function makeAddUser({ usersDB, makeUser }) {
    return async function addUser(userInfo) {

        const user = makeUser(userInfo);
        return usersDB.insert({
            system_id: user.getSystemId(),
            author: user.getAuthor(),
            detection: user.getDetection(),
            properties: user.getProperties(),
            init_date: user.getInitDate(),
            last_date: user.getLastDate(),
            knowledge: user.getKnowledge(),
            frequency: user.getFrequency(),
            created_on: user.getCreatedOn(),
            modified_on: user.getModifiedOn(),
            _id: user.getId()
        })
    }
}