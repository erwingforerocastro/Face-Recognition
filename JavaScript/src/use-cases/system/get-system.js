export default function MakeGetSystem({ systemsDB, makeSystem }) {
    return async function getSystem(systemInfo) {
        const system = makeSystem(systemInfo);
        return systemsDB.findByHash({
            hash: system.getHash()
        })
    }
}