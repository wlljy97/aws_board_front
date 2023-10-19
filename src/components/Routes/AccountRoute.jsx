import React from 'react';
import { useQueryClient } from 'react-query';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import MyPage from '../../pages/Mypage/MyPage';

function AccountRoute(props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal")
    
    if(!principalState?.data?.data) { // data에 data가 있다는 것은 로그인이 안되었다는 것
        alert("로그인 후 이용하시기 바랍니다.")
        return <Navigate to={"/auth/signin"} /> // 로그인이 안되어있으면 login page로 보냄
    }

    return (
        // 서브 라우터 singin, signup을 컨트롤
        <Routes>
            <Route path="mypage" element={ <MyPage/> }/>
            <Route path="password" element={ <></> }/>
        </Routes>
    );
}

export default AccountRoute;