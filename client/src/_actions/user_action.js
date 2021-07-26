import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER    
} from './types';

export function loginUser(dataToSubmit) {

    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}
//위 사항을 user reducer로 보낸다.


export function registerUser(dataToSubmit) {

    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}


export function auth() {

    const request = axios.get('/api/users/auth')
                    //get메소드를 이용하므로 body부분이 필요없어서 dataToSubmit를 인자로 받지않음
        .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}
