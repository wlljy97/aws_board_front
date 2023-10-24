import React from 'react';
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
/** @jsxImportSource @emotion/react */

const layout = css`
    width: 320px;
`;

const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
`;

function Sidebar(props) {
    const navigate = useNavigate();

    const queryClient = useQueryClient(); // 쿼리클라이언트 객체를 가지고옴

    const principalState = queryClient.getQueryState("getPrincipal"); //

    const handleSigninClick = () => {
        navigate("/auth/signin")
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("accessToken");
        window.location.replace("/"); // accessToken을 제거함, 재렌더링이 일어나야함
        //window.location.replace 페이지를 새로 여는 것, react의 상태가 다 날라감, navigate를 쓰면 상태가 남아있음
    }

    return (
        <div css={layout}>
            {!!principalState?.data?.data? (
                <div css={container}>
                    <h3>{principalState.data.data.nickname} 님</h3>
                    <div><button onClick={handleLogoutClick}>로그아웃</button></div>
                    <div>
                        <Link to={"/account/mypage"}>마이페이지</Link>
                    </div>
            </div>
            ) : (
            <div css={container}>
                <h3>로그인 후 게시판을 이용해보세요</h3>
                <div><button onClick={handleSigninClick}>로그인</button></div>
                <div><Link to={"/auth/forgot/password"}>비밀번호 찾기</Link></div>
                <div><Link to={"/auth/signup"}>회원가입</Link></div>
            </div>
            
            )}
            <div>
                <ul>
                    <Link to={"/board/write"}> <li>글쓰기</li></Link>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;