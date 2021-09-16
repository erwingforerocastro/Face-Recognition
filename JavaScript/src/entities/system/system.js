export default function buildMakeSystem({ validator }) {
    return function makeSystem({
        decoder,
        distance,
        date,
        features,
        type_system,
        createdOn = Date.now(),
        modifiedOn = Date.now(),
    } = {}) {

        validator({
            decoder: decoder,
            distance: distance,
            date: date,
            features: features,
            type_system: type_system
        })

        return Object.freeze({
            getDecoder: () => decoder,
            geDistance: () => distance,
            getDate: () => date,
            getFeatures: () => features,
            getTypeSystem: () => type_system,
            getCreateOn: () => createdOn,
            getModifiedOn: () => modifiedOn
        })
    }
}