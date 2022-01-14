import Id from '../../Id'

export default function makeSystemDB({ client }) {

    const collection = "systems"
    const db = client

    return Object.freeze({
        findAll,
        findById,
        findByHash,
        insert,
        remove,
        update
    })

    async function findAll({ query, parameters }) {
        const result = await db.find(collection, query, parameters)
        return result.toArray().map(({ _id: id, ...found }) => ({
            id,
            ...found
        }))
    }
    async function findById({ id: _id }) {
        const found = await db.find(collection, { _id })
        if (found.length === 0) {
            return null
        }
        const { _id: id, ...info } = found[0]
        return { id, ...info }
    }

    async function findByHash({ hash }) {
        const found = await db.findOne(collection, { hash })
        if (found == null) {
            return null
        }
        const { _id: id, ...info } = found
        return { id, ...info }
    }

    async function insert({ id: _id = Id.makeId(), ...systemInfo }) {
        const result = await db.insert(collection, { _id, ...systemInfo })
        const { _id: id, ...insertedInfo } = result.ops[0]
        return { id, ...insertedInfo }
    }

    async function update({ id: _id, ...systemInfo }) {
        await db.update(collection, { _id }, { $set: {...systemInfo } })
        return { id: _id, ...systemInfo }
    }
    async function remove({ id: _id }) {
        const result = await db.deleteOne({ _id })
        return result.deletedCount
    }
}