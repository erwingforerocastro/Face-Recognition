export default function buildMakeSystem({ Id, validator, md5 }) {
    return function makeSystem({
        decoder,
        type_service,
        max_descriptor_distance,
        min_date_knowledge,
        min_frequency,
        features,
        type_system,
        id = Id.makeId(),
        title,
        createdOn = Date.now(),
        modifiedOn = Date.now(),
    } = {}) {

        validator({
            decoder: decoder,
            max_descriptor_distance: max_descriptor_distance,
            min_date_knowledge: min_date_knowledge,
            min_frequency: min_frequency,
            features: features,
            type_system: type_system,
            type_service: type_service,
            title: title
        })

        function makeHash() {
            return md5(`${title}${type_system}`)
        }

        if (!Id.isValidId(id)) {
            throw new Error('System must have a valid id.')
        }

        return Object.freeze({
            getId: () => id,
            getDecoder: () => decoder,
            getTypeService: () => type_service,
            geMaxDescriptorDistance: () => max_descriptor_distance,
            getMinDateKnowledge: () => min_date_knowledge,
            getMinFrequency: () => min_frequency,
            getFeatures: () => features,
            getTypeSystem: () => type_system,
            getCreateOn: () => createdOn,
            getModifiedOn: () => modifiedOn,
            getHash: () => makeHash()
        })
    }
}