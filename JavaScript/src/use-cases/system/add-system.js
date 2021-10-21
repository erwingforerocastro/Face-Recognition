export default function makeAddSystem({ systemsDB, makeSystem }) {
    return async function addSystem(systemInfo) {

        const system = makeSystem(systemInfo);
        return systemsDB.insertOne({
            decoder: system.getDecoder(),
            distance: system.geDistance(),
            date: system.getDate(),
            features: system.getFeatures(),
            type_system: system.getTypeSystem(),
            createdOn: system.getCreateOn(),
            modifiedOn: system.getModifiedOn()
        })
    }
}