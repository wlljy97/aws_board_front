import React, { useEffect, useRef, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from '../../api/firebase/firebase';
import { Line } from "rc-progress";
import { Link, useNavigate } from 'react-router-dom';

const infoHeader = css`
    display: flex;
    align-items: center;
    margin: 10px;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;

`;

const imgBox = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;

    & > img {
        width: 100%;
    }
`;

const file = css`
    display: none;
`;




function MyPage(props) {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const principalState = queryClient.getQueryState("getPrincipal")
    const principal = principalState.data.data;
    const profileFileRef = useRef();
    const [ uploadFiles, setUploadFiles ] = useState([]); // 상태를 배열로 잡음
    const [ prifileImgSrc, setProfileImgSrc ] = useState("");
    const [ progressPercent, setProgressPercent ] = useState(0);

    useEffect(() => {
        setProfileImgSrc(principal.profileUrl);
    }, [])

    const handleProfileUploadClick = () => {
        if(window.confirm("프로필 사진을 변경하시겠습니까?"))
        profileFileRef.current.click(); // 클릭시 프로필사진 변경
    }

    const handleProfileChange = (e) => {
        const files = e.target.files;

        if(!files.length) {
            setUploadFiles([]);
            e.target.value = "";
            return;
        }

        // 여러개의 파일들을 쓸 때
        for(let file of files) {
            setUploadFiles([...uploadFiles, file]); // setUploadFiles([...uploadFiles, file[0]]); 한개의 파일 쓸때
        }
            
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImgSrc(e.target.result);
        }

        reader.readAsDataURL(files[0]) 
    }

    const handleUploadSubmit = () => {
        const storageRef = ref(storage, `files/profile/${uploadFiles[0].name}`); // ref "" firebase전용함수, storageRef : 저장소정보
        const uploadTask = uploadBytesResumable(storageRef, uploadFiles[0]); // 여기까지만 실행되도 파일이 올라감

        uploadTask.on( // upload가 시작되면은
            "state_changed",
            (snapshot) => { // 프로그레스 나타내기 위함 , snapshot안에는 퍼센트가 들어가있음
                setProgressPercent(
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) // 1퍼센트 씩 증가 한다. 
                )
            },
            (error) => {
                console.error(error);
            },
            () => {
                getDownloadURL(storageRef).then(downloadUrl => {
                    const option = {
                        headers: {
                            Authorization: localStorage.getItem("accessToken")
                        }
                    }
                    instance.put("/account/profile/img", {profileUrl: downloadUrl}, option)
                    .then((response) => {
                        alert("프로필 사진이 변경되었습니다.");
                        window.location.reload();
                    })

                })
            }
        )
    }

    const handleUploadCancel = () => {
        setUploadFiles([]);
        profileFileRef.current.value = "";
    }

    const handleSendMail = async () => {
        try{
            const option = {
                headers: {
                Authorization: localStorage.getItem("accessToken")
                }
            }
            await instance.post("/account/mail/auth", {}, option);
            alert("인증메일 전송완료. 인증 요청 메일을 확인해주세요.")
        } catch(error) {
            alert("인증메일 전송 실패. 다시 시도해주세요.")
        }
    }

    return (
        <RootContainer>
            <div>
                <div css={infoHeader}>
                    <div>
                        <div css={imgBox} onClick={handleProfileUploadClick}>
                            <img src={prifileImgSrc} alt="" />
                        </div>
                        <input css={file} type="file" onChange={handleProfileChange} ref={profileFileRef} />
                        {!!uploadFiles.length && 
                            <div>
                                <Line percent={progressPercent} strokeWidth={4} strokeColor="#dbdbdb" />
                                <button onClick={handleUploadSubmit}>변경</button>
                                <button onClick={handleUploadCancel}>취소</button>
                            </div> 
                        }
                    </div>
                    <div>
                        <h3>누적포인트: 0원</h3>
                        <button onClick={() => {navigate("/store/products")}}>포인트 구매</button>
                    </div>
                </div>
                <div>
                    <div>닉네임: {principal.nickname}</div>
                    <div>이름: {principal.name}</div>
                    <div>
                        이메일: {principal.email} {principal.enabled 
                        ? <button disabled={true}>인증완료</button>
                        : <button onClick={handleSendMail}>인증하기</button>}
                    </div>
                    <Link to={"/account/password"}>비밀번호 변경</Link>
                </div>
            </div>
        </RootContainer>
    );
}

export default MyPage;