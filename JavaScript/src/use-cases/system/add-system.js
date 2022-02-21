export default function makeAddSystem({ systemsDB, makeSystem }) {
    return async function addSystem(systemInfo) {

        const system = makeSystem(systemInfo);
        return systemsDB.insert({
            decoder: system.getDecoder(),
            title: system.getTitle(),
            type_service: system.getTypeService(),
            max_descriptor_distance: system.geMaxDescriptorDistance(),
            min_date_knowledge: system.getMinDateKnowledge(),
            min_frequency: system.getMinFrequency(),
            features: system.getFeatures(),
            type_system: system.getTypeSystem(),
            hash: system.getHash(),
            created_on: system.getCreatedOn(),
            modified_on: system.getModifiedOn(),
            _id: system.getId()
        })
    }
}