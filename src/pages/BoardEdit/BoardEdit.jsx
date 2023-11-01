import React, { useEffect, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { instance } from '../../api/config/instance';
import { css } from '@emotion/react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
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


function BoardEdit(props) {

    const { boardId } = useParams();
    const navigate = useNavigate();

    const [ boardContent, setBoardContent ] = useState({ // board에 셋팅을 해줘야 여기에 있는 data들이 들어온다.
        title: "",
        content: "",
        categoryId: 0,
        categoryName: ""
    });

    const [ categories, setCategories ] = useState([]);
    const [ newCategory, setNewCategory ] = useState("");
    const [ selectOptions, setSelectOptions ] = useState([]);
    const [ selectedOption, setSelectedOption ] = useState(selectOptions[0]); // selectedOption이 들어와야 categoryName이 들어온다.

    const queryClient = useQueryClient();

    const getBoard = useQuery(["getBoard"], async () => {
        try{
            return await instance.get(`/board/${boardId}`)
        }catch(error){
            alert("해당 게시글을 불러올 수 없습니다.")
            navigate("/board/all/1")
        }
    }, {
        refetchOnWindowFocus: false,
        onSuccess: response => {
            setBoardContent({
                ...boardContent,
                title: response.data.boardTitle,
                content: response.data.boardContent
            })

            const category = selectOptions.filter(option => option.value === response.data.boardCategoryId)[0];
            setSelectedOption(category);
        },
        enabled: selectOptions.length > 0 // enabled가 false이면 어떠한 경우에서도 요청을 날리지 않음, true이면 요청을 날림
    })

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
            setCategories(response.date);
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
    }, [selectedOption]);

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

    const handleEditSubmit = async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            await instance.put(`/board/${boardId}`, boardContent, option);
            alert("게시글 수정 완료");
            navigate(`/board/${boardId}`);
        } catch(error) {
            console.error(error);
            alert("게시글 수정 오류");
            navigate(`/board/${boardId}`);
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
                <div><input css={titleInput} type="text" name="title" placeholder='제목' onChange={handleTitleInput} value={boardContent.title}/></div>
                <div>
                    <ReactQuill 
                        style={{width: "928px", height: "500px"}} 
                        modules={modules} 
                        value={boardContent.content}
                        onChange={handleContentInput} />
                </div>
                <div css={buttonContainer}>
                    <button onClick={handleEditSubmit}>수정하기</button>
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardEdit;