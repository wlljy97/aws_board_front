import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';
import { useQueryClient } from 'react-query';
import SignupOauth2 from '../../pages/Signup/SignupOauth2';
import SignupOauth2Merge from '../../pages/Signup/SignupOauth2Merge';
import SigninOauth2 from '../../pages/Signin/SigninOauth2';

function AuthRoute(props) {

    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal")
    
    if(!!principalState?.data?.data) { // data에 data가 있다는 것은 로그인이 되었다는 것
        
        return <Navigate to={"/"} /> // 렌더링이 일어나야 하기때문에/ 로그인이 되어 있으면 로그인창,회원가입 창 말고 바로 홈으로 보냄
    }

    return (
        // 서브 라우터 singin, signup을 컨트롤
        <Routes>
            <Route path="signin" element={ <Signin/> }/>
            <Route path="oauth2/login" element={ <SigninOauth2/> }/>
            <Route path="signup" element={ <Signup/> }/>
            <Route path="oauth2/signup" element={ <SignupOauth2/> }/>
            <Route path="oauth2/signup/merge" element={ <SignupOauth2Merge/> }/>
        </Routes>
    );
}

export default AuthRoute;