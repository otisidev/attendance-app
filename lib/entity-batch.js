/**
 * batching returned data in correct order
 * @param {Array<string>} ids list of object id
 * @param {Array<any>} cb list of object
 */
const batchResult = (ids, cb) => {
    //
    const objMap = {};

    cb.forEach(item => {
        objMap[item.id] = item;
    });
    return ids.map(id => objMap[id]);
};

exports.batchResult = batchResult;
