export default function makeUpdateUser({ usersDB, makeUser }) {
    return async function updateUser({ id, ...changes } = {}) {

        if (!id) {
            throw new Error('You must supply an id.')
        }

        const existingUser = await usersDB.findById({ id });

        if (!existingUser) {
            throw new Error("User nof found, require create system");
        }

        const user = makeUser({...existingUser, ...changes });

        return usersDB.update({
            _id: id,
            system_id: user.getSystemId(),
            author: user.getAuthor(),
            detection: user.getDetection(),
            properties: user.getProperties(),
            init_date: user.getInitDate(),
            last_date: user.getLastDate(),
            knowledge: user.getKnowledge(),
            frequency: user.getFrequency(),
            modified_on: user.getModifiedOn(),
        })
    }
}