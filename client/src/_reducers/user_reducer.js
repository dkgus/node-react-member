
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

//user_action에서 type이 바뀔 때 마다 여러가지 타입이 생성되기때문에 switch문으로 처리

export default function foo(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload } //node(back)에서 보내온 정보를action.payload에 담음
                                                                //back index페이지에서 로그인 성공시 loginSuccess를 true를 보낸다했기때문
            break;
        
        case AUTH_USER:
            return { ...state, userData: action.payload }//action.payload이쪽에 node의 index.js에 담긴 모든 유저정보가 들어있음. 그래서 userData라는이름사용. 다른이름도 사용가능
            break;
         
            default:
                return state;
        }
    }