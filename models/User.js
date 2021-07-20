const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken")

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


userSchema.methods.comparePassword = function (plainPassword, cb) { //comparePassword의 이름은 아무거나 변경가능하지만, index(route)파일에서도 변경해줘야함
                                            //사용자가 입력한 비밀번호와 콜백함수
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        //bcrypt.compare를 통해 사용자가입력한 비밀번호(plainPassword),와 해시화 된 비밀번호 (this.password)를 비교가능 
        
        if (err) return cb(err);
        //만약 위에 두개 비교한 것이 일치하지 않는다면 cb(callback)을 통해 err를 리턴하고
        cb(null, isMatch)//두개 비밀번호가 같다면 cb의 에러는 없고(null), 비밀번호는 같다는 isMatch(true)를 반환
        //그리고 이것은 다시 index(route)의 comparePassword로 간다
    })
}


userSchema.methods.generateToken = function (cb) {
    //jsonwebtoekn을 이용해서 token을 생성하기
    let user = this;//user 모델 전체를 의미할 수 있게 this하기
    let token = jwt.sign(user._id.toHexString(), 'secret')//user._id는  db안에 user안에 있는 긴 숫자
    //let oneHour = moment().add(1, 'hour').valueOf();

   //user.tokenExp = oneHour;
   
   //위에 user모델안에 toekn안에 방금 제조한 token변수를 넣어준다는 것임
    user.token = token;
    user.save(function (err, user) {//그리고 이것을 save함
        if (err) return cb(err)
        cb(null, user);//에러가 null없다면 user정보만 전달 (이 user정보는 index.js(route)안 generateToken에서 인자로받는 user로 전달됨 )
    })
}


userSchema.statics.findByToken = function (token, cb) {
    var user = this;


    //토큰을 decode한다.  secret은 인코드할때 썼던것
    jwt.verify(token, 'secret', function (err, decode) {

        //유저아이디를 이용해서 유저를 찾은 뒤(findOne)
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) return cb(err);//에러가 있을때
            cb(null, user);//에러가 없을 때
        })
    })
} 

const User = mongoose.model('User', userSchema);

module.exports = { User }
