export default function makeDeleteSystem({ systemsDB }) {
    return async function deleteSystem({ id, ...otherInfo } = {}) {
        if (!id) {
            throw new Error('You must supply an id.')
        }
        return systemsDB.delete({
            id: id,
            ...otherInfo
        })
    }
}