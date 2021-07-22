import axios from 'axios';
import {
    LOGIN_USER
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