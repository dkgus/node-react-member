import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {

    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)
                //로그인 하지 않은 상태 
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push('/login')
                    }
                } else {
                    //로그인 한 상태 

                    //관리자
                    if (adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    } else {
                         //로그인한 회원이 회원가입페이지나 로그인페이지로 이동할때
                        if (option === false)
                            props.history.push('/')
                    }
                }
            })
        }, [])
////action이름 auth로 생성/ user reducer까지 마무리후 이 reponse안에는 백엔드에서 처리해서 가져온 정보가 들어있음
        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}