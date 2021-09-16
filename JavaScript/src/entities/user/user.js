export default function buildMakeUser({ Id }) {
    return function makeComment({
        id = Id.makeId(),
        author,
        createdOn = Date.now(),
        modifiedOn = Date.now(),
    } = {}) {
        if (!Id.isValidId(id)) {
            throw new Error('Comment must have a valid id.')
        }

        return Object.freeze({
            getAuthor: () => author,
            getCreatedOn: () => createdOn,
            getHash: () => hash || (hash = makeHash()),
            getId: () => id,
        })


    }
}