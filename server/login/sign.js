const User = require('../model').User

module.exports = (reslove, reject, data) => {
    User
        .findOne({email: data.email})
        .exec()
        .then(user => {
            if(user) {
                reject('邮箱已被注册')
            } else {
                User.create({
                    name: data.name,
                    password: data.password,
                    email: data.email
                }, (err) => {
                    if (err) {
                        console.log(err)
                        reject('注册失败')
                    }
                    User.findOne({email: data.email}).exec().then(user => {
                        //
                        reslove({_id: user._id, name: user.name, msg: '注册成功'})
                    })
                    
                })
            }
            
        }).catch((err) => {
            console.log(err)
            reject('注册失败')
        })
}