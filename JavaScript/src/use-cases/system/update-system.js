import { makeSystem } from "../../entities";
import makeAddSystem from "./add-system";

export default function makeUpdateSystem({ systemsDB }) {
    return async function updateSystem({ id, ...changes } = {}) {
        if (!id) {
            throw new Error('You must supply an id.')
        }
        const existingSystem = await systemsDB.findById({ id })
        if (!existingSystem) {
            makeAddSystem()
        }
        const system = makeSystem({...existingSystem, ...changes });
        return systemsDB.update({
            id: id,
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