export default function MakeGetSystem({ systemsDB }) {
    return async function getSystem(id) {
        return systemsDB.findById({ id })
    }
}