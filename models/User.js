const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({


    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },

    image: String,

    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }

})
    

userSchema.pre('save', function (next) { //mongoose에서 가져온 메소드 pre. 이것은 save하기 전단계에서  다음(=function)과 같은 작업을 하갰다는 뜻임
    let user = this; //이것은 유저스키마를 가리킴

    if (user.isModified('password')) { //다른정보를 변경할때가 아닌 패스워드를 변경할 때만 아래의 작업진행되도록함
        // console.log('password changed')
        bcrypt.genSalt(saltRounds, function (err, salt) {//salt만들기! 이때 saltRounds가 필요
            if (err) return next(err); //에러가 생기면 바로 save()로 이동

            bcrypt.hash(user.password, salt, function (err, hash) {//여기서 user.password는 위에 this로 user스키마를 가리킨후 그안의 password를 의미
                                    //다음으로 인자로받아온 salt넣어주기, 인자로 넣어주는 hash는 암호화된 비밀번호를 말함
                
                if (err) return next(err);
                user.password = hash//그래서 유저의 비밀번호를 hash로 교체해준다
                next() //이게 있어야만 수행후 save()로 이동가능
            })
        })
    } else {//만약 비밀번호를 바꾸는상황이아니라면 바로 next를 통해 다음으로 보내준다.
        next()
    }
});
const User = mongoose.model('User', userSchema);

module.exports = { User }
