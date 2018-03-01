const Group = require("../../model").Group

module.exports = (allSocketList, socket) => ({ keyword }) => {//
    Group
        .find({
            name: {$regex: new RegExp(keyword)}
        })
        .select('_id name avatar ')
        .limit(5)
        .exec()
        .then(groups => {
            if (!groups) return []
            return groups
        })
        .then(list => {
            socket.emit('searchGroups', list)
        })
        .catch(err => {
            socket.emit('searchGroups', {error: '搜索群组失败'})
        })
}