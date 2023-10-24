import React, { useEffect, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { instance } from '../../api/config/instance';
import { css } from '@emotion/react';
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

    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState(selectOptions[0]);

    useEffect(() => {
        instance.get("/board/categories")
        .then((response) => {
            setSelectOptions(
                response.data.map(
                    category => {
                        return {value: category.boardCategoryName, label:category.boardCategoryName}
                    }
                )
            )
        })
    }, [])

    useEffect(() => {
        if(!!newCategory) {
            const newOption = { value: newCategory, label: newCategory }

            setSelectedOption(newOption); // 새로운 카테고리
            if(!selectOptions.map(option => option.value).includes(newOption.value)) {
                setSelectOptions([
                    ...selectOptions, // 추가
                    newOption // newOpion이 포함되어 있지 않을 때 추가를 해줌
                ])
            }
        }
    }, [newCategory])

    const modules = {
        toolbar: {
            container: [
                [{header: [1, 2, 3, false]}],
                ["bold", "underline"],
                ["image"]
            ]
        }
    }

    const handleTitleInput = () => {

    }

    const handleContentInput = (value) => {

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
                    <button>작성하기</button>
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardWrite;