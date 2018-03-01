const User = require('../model').User
const fs = require('fs')
const mineType = require('mime-types')

module.exports = (reslove, reject, data) => {
    User
        .findOne({email: data.email})
        .exec()
        .then(user => {
            if(user) {
                reject('邮箱已被注册')
            } else {
                if(!data.avatar) {
                    data.avatar = fs.readFileSync('./login/img/temp.jpg')  
                    data.avatar = new Buffer(data.avatar).toString('base64')
                    data.avatar = 'data:'+ mineType.lookup('./login/img/temp.jpg') +';base64,'+data.avatar
                }
                User.create({
                    name: data.name,
                    password: data.password,
                    email: data.email,
                    avatar: data.avatar
                }, (err) => {
                    if (err) {
                        console.log(err)
                        reject('注册失败')
                    }
                    User.findOne({email: data.email}).exec().then(user => {
                        //
                        reslove({_id: user._id, name: user.name, avatar: user.avatar, msg: '注册成功'})
                    })
                    
                })
            }
            
        }).catch((err) => {
            console.log(err)
            reject('注册失败')
        })
}