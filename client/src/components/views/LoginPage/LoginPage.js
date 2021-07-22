import React, { useState } from 'react'
import Axios from 'axios'
import {useDispatch} from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
 
function LoginPage(props) {

    const dispatch = useDispatch();//새로 디스패치 생성

    const [Email, setEamil] = useState("")//처음 기본값은 "" 빈 값
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) =>{
        setEamil(event.currentTarget.value)
    }

    const onPasswordHandler = (event) =>{
        setPassword(event.currentTarget.value)
    }

    const onsubmitHandler = (event) =>{
        event.preventDefault();//이 코드가 누락되면 자꾸 페이지가 새로고침되어 원래 뒤에오는 기능이 작동하지않음

        let body = {
            email: Email,
            password: Password
        }
        
        //loginUser라는 액션을 임의로 생성. _action/user_action.js안에 있음
        dispatch(loginUser(body))
        .then(response =>{
            if(response.payload.loginSuccess) {
                props.history.push('/')//prop는 loginPage함수의 인자로 받은것
            }else{
                alert('Error')
            }
        })

        Axios.post("/api/users/login", body)
        

    }

    return (
        <div style={{ display: 'flex', justifyContent:"center", alignItems:"center",
                      width:"100%", height:"100vh" 
        }}>
            
            <form style={{ display:'flex', flexDirection:"column" }}
                onSubmit={onsubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>

                <label>Paswword</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br />
                
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage