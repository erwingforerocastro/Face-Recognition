export default function buildMakeUser({ Id }) {
    return function makeUser({
        id = Id.makeId(),
        systemId,
        author,
        detection,
        properties = {},
        initDate,
        lastDate,
        knowledge = false,
        frequency = 1,
        createdOn = Date.now(),
        modifiedOn = Date.now(),
    } = {}) {

        if (!Id.isValidId(id)) {
            throw new Error('User must have a valid id.')
        }

        return Object.freeze({
            getDetection: () => detection,
            getProperties: () => properties,
            getInitDate: () => initDate,
            getLastDate: () => lastDate,
            getKnowledge: () => knowledge,
            getFrequency: () => frequency,
            getAuthor: () => author,
            getCreatedOn: () => createdOn,
            getModifiedOn: () => modifiedOn,
            getSystemId: () => systemId,
            getId: () => id,
        })


    }
}