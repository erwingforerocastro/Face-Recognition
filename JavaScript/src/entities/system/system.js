export default function buildMakeSystem({ Id, validator, md5 }) {
    return function makeSystem({
        decoder,
        typeService,
        maxDescriptorDistance,
        minDateKnowledge,
        minFrequency = 0.7,
        features,
        typeSystem,
        id = Id.makeId(),
        title = title,
        createdOn = Date.now(),
        modifiedOn = Date.now(),
    } = {}) {

        validator({
            decoder: decoder,
            maxDescriptorDistance: maxDescriptorDistance,
            minDateKnowledge: minDateKnowledge,
            minFrequency: minFrequency,
            features: features,
            typeSystem: typeSystem,
            typeService: typeService,
            title: title
        })

        function makeHash() {
            return md5(`${title}${typeSystem}`)
        }

        if (!Id.isValidId(id)) {
            throw new Error('System must have a valid id.')
        }

        return Object.freeze({
            getId: () => id,
            getDecoder: () => decoder,
            getTypeService: () => typeService,
            geMaxDescriptorDistance: () => maxDescriptorDistance,
            getMinDateKnowledge: () => minDateKnowledge,
            getMinFrequency: () => minFrequency,
            getFeatures: () => features,
            getTypeSystem: () => typeSystem,
            getCreateOn: () => createdOn,
            getModifiedOn: () => modifiedOn,
            getHash: () => makeHash()
        })
    }
}