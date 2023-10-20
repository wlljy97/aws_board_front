import React, { useState } from 'react';
import { css } from '@emotion/react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { instance } from '../../api/config/instance';
/** @jsxImportSource @emotion/react */

function EditPassword(props) {
    const [ passwordObj, setPasswordObj ] = useState({ // {} <- 객체를 집어넣음
        oldPassword: "",
        newPassword: "",
        checkNewPassword: ""
    });

    const handleInputChange = (e) => {
        setPasswordObj({
            ...passwordObj,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdatePasswordSubmit = async () => {
        try{
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            await instance.put("/account/password", passwordObj, option);
        }catch(error) {
            console.log(error)
        }
    }

    return (
        <RootContainer>
            <div>
                <div><input type="password" name='oldPassword' onChange={handleInputChange} placeholder='이전 비밀번호' /></div>
                <div><input type="password" name='newPassword' onChange={handleInputChange} placeholder='새 비밀번호' /></div>
                <div><input type="password" name='checkNewPassword' onChange={handleInputChange} placeholder='새 비밀번호 확인' /></div>
                <button onClick={handleUpdatePasswordSubmit}>변경하기</button>
            </div>
        </RootContainer>
    );
}

export default EditPassword;