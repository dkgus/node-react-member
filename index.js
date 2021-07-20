const express = require("express");
const app = express();
const port = 5555;
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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
app.post('/register',(req,res)=>{
    
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



app.listen(port, () => console.log(`listening on port ${port}!`))