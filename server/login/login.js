const User = require('../model').User

module.exports = (reslove, reject, data) => {
    User
        .findOne({email: data.email})
        .exec()
        .then(user => {
            if (!user) {
                reject('该用户不存在')
            } else if (data.password !== user.password) {
                reject('密码错误')
            } else {
                //
                reslove({_id: user._id, name: user.name, msg: '登录成功'})  
            }
        }).catch(() => {
            reject('登录失败')
        })
}