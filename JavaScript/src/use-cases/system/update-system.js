export default function makeUpdateSystem({ systemsDB, makeSystem }) {
    return async function updateSystem({ id, ...changes } = {}) {

        if (!id) {
            throw new Error('You must supply an id.')
        }

        const existingSystem = await systemsDB.findById({ id });
        const system = makeSystem({...existingSystem, ...changes });

        if (!existingSystem) {
            return system
        }

        return systemsDB.update({
            id: id,
            type_sevice: system.getTypeService(),
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