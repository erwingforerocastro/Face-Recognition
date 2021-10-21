export default function buildMakeUser({ Id }) {
    return function makeUser({
        id = Id.makeId(),
        author,
        createdOn = Date.now(),
        modifiedOn = Date.now(),
    } = {}) {
        if (!Id.isValidId(id)) {
            throw new Error('User must have a valid id.')
        }

        return Object.freeze({
            getAuthor: () => author,
            getCreatedOn: () => createdOn,
            getModifiedOn: () => modifiedOn,
            getId: () => id,
        })


    }
}