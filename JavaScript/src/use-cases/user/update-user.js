export default function makeUpdateUser({ usersDB, makeUser }) {
    return async function updateUser({ id, ...changes } = {}) {

        if (!id) {
            throw new Error('You must supply an id.')
        }

        const user = makeUser({ id, ...changes });

        return usersDB.update({
            id: id,
            system_id: user.getSystemId(),
            author: user.getAuthor(),
            detection: user.getDetection(),
            properties: user.getProperties(),
            init_date: user.getInitDate(),
            last_date: user.getLastDate(),
            knowledge = user.getKnowledge(),
            frequency: user.getFrequency(),
            author: user.getAuthor(),
            created_on: user.getCreatedOn(),
            modified_on: user.getModifiedOn(),
            id: user.getId()
        })
    }
}