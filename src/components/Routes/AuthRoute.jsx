import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';
import { useQueryClient } from 'react-query';

function AuthRoute(props) {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal")
    
    if(!!principalState?.data?.data) { // data에 data가 있다는 것은 로그인이 되었다는 것
        
        return <Navigate to={"/"} /> // 렌더링이 일어나야 하기때문에/ 로그인이 되어 있으면 로그인창,회원가입 창 말고 바로 홈으로 보냄
    }

    return (
        // 서브 라우터 singin, signup을 컨트롤
        <Routes>
            <Route path="signin" element={ <Signin/> }/>
            <Route path="signup" element={ <Signup/> }/>
        </Routes>
    );
}

export default AuthRoute;