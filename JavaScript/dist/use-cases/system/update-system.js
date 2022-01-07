"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeUpdateSystem;

function makeUpdateSystem({
  systemsDB,
  makeSystem
}) {
  return async function updateSystem({
    id,
    ...changes
  } = {}) {
    if (!id) {
      throw new Error('You must supply an id.');
    }

    const existingSystem = await systemsDB.findById({
      id
    });
    const system = makeSystem({ ...existingSystem,
      ...changes
    });

    if (!existingSystem) {
      throw new Error("System nof found, require create system");
    }

    return systemsDB.update({
      id: id,
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
    });
  };
}