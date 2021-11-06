export default function makeAddSystem({ systemsDB, makeSystem }) {
    return async function addSystem(systemInfo) {

        const system = makeSystem(systemInfo);
        return systemsDB.insertOne({
            decoder: system.getDecoder(),
            type_service: system.getTypeService(),
            max_descriptor_distance: system.geMaxDescriptorDistance(),
            min_date_knowledge: system.getMinDateKnowledge(),
            min_frequency: system.getMinFrecuency(),
            features: system.getFeatures(),
            type_system: system.getTypeSystem(),
            hash: system.getHash(),
            created_on: system.getCreateOn(),
            modified_on: system.getModifiedOn()
        })
    }
}