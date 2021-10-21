export default function buildMakeSystem({ Id, validator }) {
    return function makeSystem({
        decoder,
        maxDescriptorDistance,
        minDateKnowledge,
        features,
        typeSystem,
        id = Id.makeId(),
        createdOn = Date.now(),
        modifiedOn = Date.now(),
    } = {}) {

        validator({
            decoder: decoder,
            maxDescriptorDistance: maxDescriptorDistance,
            minDateKnowledge: minDateKnowledge,
            features: features,
            typeSystem: typeSystem
        })

        if (!Id.isValidId(id)) {
            throw new Error('System must have a valid id.')
        }

        return Object.freeze({
            getId: () => id,
            getDecoder: () => decoder,
            geMaxDescriptorDistance: () => maxDescriptorDistance,
            getMinDateKnowledge: () => minDateKnowledge,
            getFeatures: () => features,
            getTypeSystem: () => typeSystem,
            getCreateOn: () => createdOn,
            getModifiedOn: () => modifiedOn
        })
    }
}