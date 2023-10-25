import React, { useEffect, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { instance } from '../../api/config/instance';
import { css } from '@emotion/react';
import { useQueryClient } from 'react-query';
/** @jsxImportSource @emotion/react */

const buttonContainer = css`
    display: flex;
    justify-content: flex-end; // 오른쪽 끝으로 보냄
    align-items: center;
    margin-top: 50px;
    width: 100%;
    
`;

const categoryContainer = css`
    display: flex;
    margin-bottom: 10px;
`;

const selectBox = css`
    flex-grow: 1;
`;

const titleInput = css`
    margin-bottom: 10px;
    width: 100%;
    height: 50px;
`;


function BoardWrite(props) {

    const [ boardContent, setBoardContent ] = useState({
        title: "",
        content: "",
        categoryId: "",
        categoryName: ""
    });

    const [ categories, setCategories ] = useState([]);
    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState(selectOptions[0]);

    const queryClient = useQueryClient();

    // 로그인과 인증 되지 않았을 때
    useEffect(() => {
        const principal = queryClient.getQueryState("getPrincipal");
        console.log(principal)

        if(!principal.data) {
            alert("로그인 후 게시글을 작성하세요.");
            window.location.replace("/");
            return;
        }

        if(!principal?.data?.data.enabled) {
            alert("이메일 인증 후 게시글을 작성하세요.");
            window.location.replace("/account/mypage");
            return;
        }
    }, [])

    useEffect(() => {
        instance.get("/board/categories") 
        .then((response) => {
            setSelectOptions(response.date);
            setSelectOptions(
                response.data.map(
                    category => {
                        return {value: category.boardCategoryId, label: category.boardCategoryName}
                    }
                )
            )
        })
    }, [])

    useEffect(() => {
        if(!!newCategory) {
            const newOption = { value: 0, label: newCategory }

            setSelectedOption(newOption); // 새로운 카테고리 추가 되었을때 uesEffect에 추가
            if(!selectOptions.map(option => option.label).includes(newOption.label)) {
                setSelectOptions([
                    ...selectOptions, //
                    newOption // newOpion이 포함되어 있지 않을 때 추가를 해줌
                ])
            }
        }
    }, [newCategory])

    useEffect(() => {
        setBoardContent({
            ...boardContent,
            categoryId: selectedOption?.value, // value에다가 id 값을 넣어준다.
            categoryName: selectedOption?.label //  label 에다가 name 값을 넣어준다.
        });
    }, [selectedOption])

    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, 3, false]}],
                ["bold", "underline"],
                ["image"]
            ]
        }
    }

    const handleTitleInput = (e) => {
        setBoardContent({
            ...boardContent,
            title: e.target.value
        });
    }

    const handleContentInput = (value) => {
        setBoardContent({
            ...boardContent,
            content: value
        });
    }

    const handleSelectChange = (option) => {
        setSelectedOption(option);
    }

    const handleCategoryAdd = () => {
        const categoryName = window.prompt("새로 추가할 카테고리명을 입력하세요.");
        if(!categoryName) { // 카테고리이름이 비었으면 리턴
            return;
        }
        setNewCategory(categoryName)
    }

    const handleWriteSubmit = async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            await instance.post("/board/content", boardContent, option);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <RootContainer>
            <div>
                <h1>글쓰기</h1>
                <div css={categoryContainer}>
                    <div css={selectBox}>
                        <Select 
                            options={selectOptions}
                            onChange={handleSelectChange}
                            defaultValue={selectedOption}
                            value={selectedOption}
                        />
                    </div>
                    <button onClick={handleCategoryAdd}>카테고리 추가</button>
                </div>
                <div><input css={titleInput} type="text" name="title" placeholder='제목' onChange={handleTitleInput}/></div>
                <div>
                    <ReactQuill 
                        style={{width: "928px", height: "500px"}} 
                        modules={modules} 
                        onChange={handleContentInput}/>
                </div>
                <div css={buttonContainer}>
                    <button onClick={handleWriteSubmit}>작성하기</button>
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardWrite;