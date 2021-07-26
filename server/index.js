const express = require("express");
const app = express();
const port = 5555;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({extended: true}));


app.use(bodyParser.json());
app.use(cookieParser());


const mongoose =require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => console.log("MongoDB Connected..."))
.catch((err) => console.log(err));



app.get('/',(req,res)=> res.send('hello world! wow!'));

app.get("/api/hello",(req,res)=>{
    res.send("안녕하세요");
})


app.post('/api/users/register',(req,res)=>{
    
    //회원 가입할 때 필요한 정보를을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다
    //데이터베이스에 넣기 전에 hash가 적용되어야하기 때문에 save전 단계에서 적용필요
    const user = new User(req.body)

    user.save((err,doc)=>{
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true   
        })
    })
})




app.post("/api/users/login", (req, res) => {
   
    //요청된 이메일을 데이터베이스 안에 있는지 찾는다.
     User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "없는 아이디 입니다."

            });


        //요청된 이메일이 db안에 있다면(=유저가 있다면), 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {//comparePassword메소드는 user모델에서 생성
            if (!isMatch)//비밀번호가 일치하지않는다면
                return res.json({ loginSuccess: false, message: "Wrong password" });

        
            // 비밀번호까지 맞다면 그 유저를 위한 token생성하기
            user.generateToken((err, user) => {//generateToken의 이름은 임의로 생성. 그리고 다시 user스키마로가서 generateToken 처리함수 만들기
                                    //여기서 user는 generateToken함수에서 사용자의아이디와 토큰을 합쳐 리턴된 정보임 generateToken에서 받음
                if (err) return res.status(400).send(err);
               // res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)//토큰을 쿠키에 저장하는 것임(토큰은 쿠키나 로컬스토리지,세션등에 저장가능)
                    //여기선 쿠키활용(cookie-parser설치필요)w_auth이름은 그냥 쿠키의 이름
                    .status(200)//성공했다는것
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});


app.post('', auth , (req,res)=>{

    //여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 True라는 뜻
    res.status(200).json({
        _id: req.user._id, //auth.js에서 req에 넣어놨기 때문에 이렇게 사용가능
        isAdmin:req.user.role === 0 ? false: true,//0이 아니면 관리자
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
});



app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
                        //여기서 찾는 아이디는  auth미들웨어에서  user를 req.user에 담아줬기때문에 가져와서 찾을 수 있음
                        //토큰지우기, 유효기간도! 
                        // tokenExp: "" 일단 주석
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

app.listen(port, () => console.log(`listening on port ${port}!`))