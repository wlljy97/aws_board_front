import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signin from '../../pages/Signin/Signin';
import Signup from '../../pages/Signup/Signup';

function Auth(props) {
    return (
        // 서브 라우터 singin, signup을 컨트롤
        <Routes>
            <Route path="signin" element={ <Signin/> }/>
            <Route path="signup" element={ <Signup/> }/>
        </Routes>
    );
}

export default Auth;