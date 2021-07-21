const { User } = require('../models/User');

let auth = (req, res, next) => {

    //인증처리를 하는 곳

    //클라이언트 쿠키에서 토큰을 가져오기 (cookie-parser활용)
    let token = req.cookies.w_auth; //일전에 쿠키의 이름을 w_auth로 지정


    //토큰을 복호화 한 후 유저를 찾는다.(유저 모델에서 메소드를 생성하여 이용)

    User.findByToken(token, (err, user) => { //유저 스키마안에 findByToken 생성하기
        if (err) throw err;
        if (!user)//유저가 없으면 인증 no
        return res.json({
            isAuth: false,
            error: true
        });


    //유저가 있으면 인증 ok
        req.token = token;//사용할 수 있게 하기위해 둘다 req에 담는다 
        req.user = user;
        next();
    });

    

    
};

module.exports = { auth };