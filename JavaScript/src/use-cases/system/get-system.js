export default function MakeGetSystem({ systemsDB }) {
    return async function getSystem(systemInfo) {
        const system = makeSystem(systemInfo);
        return systemsDB.findByHash({
            hash: system.getHash()
        })
    }
}