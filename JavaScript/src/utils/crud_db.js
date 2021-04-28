const mongoConnector = require('db.js')

const insert = async(collection, query) => {
    const connection = await mongoConnector
    return await connection.collection(collection).insertOne(query).catch(err => {
        if (err) throw err
    })
}

const update = async(collection, query, newvalues) => {
    const connection = await mongoConnector
    return await connection.collection(collection).update(query, newvalues).catch(err => {
        if (err) throw err
    })
}

const find = async(collection, query = {}, parameters = {}) => {
    const connection = await mongoConnector
    return await connection.collection(collection).find(query, parameters).toArray(function(err, result) {
        if (err) throw err;
        return result;
    });
}

const findOne = async(collection, query = {}, parameters = {}) => {
    const connection = await mongoConnector
    return new Promise((resolve) => {
        connection.collection(collection).findOne(query, parameters, (err, result) => {
            if (err) throw err;
            resolve(result);
        });
    })
}

module.exports = {
    insert,
    update,
    find,
    findOne,
}