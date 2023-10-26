import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import RootContainer from '../../components/RootContainer/RootContainer';
import { css } from '@emotion/react';
import ReactSelect from 'react-select';
import { instance } from '../../api/config/instance';
import { useQuery } from 'react-query';
/** @jsxImportSource @emotion/react */

const table = css`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #dbdbdb;

    & th, td {
        border: 1px solid #dbdbdb;
        height: 30px;
        text-align: center;
    }

    & td {
        cursor: pointer;
    }
`;

const searchContainer = css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    width: 100%;

    & > * {
        margin-left: 5px;
    }
`;

const selectBox = css`
    width: 100px;

`;

const SPageNumbers = css`
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 200px;

    & button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px 3px;
        width: 20px;
        border: 1px solid #dbdbdb;
        cursor: pointer;
    }

`;

const SBoardTitle = css`
    max-width: 500px;
    width: 500px;
    overflow: hidden;
    text-overflow: ellipsis; // 글자가 긴경우 ... 처리하게 만드는 방법
    white-space: nowrap; // 튀어나오는거 처리하게 하는 방법
`;

function BoardList(props) {

    const navigate = useNavigate();
    const { category, page } = useParams();

    const options = [
        {value: "전체", label: "전체"},
        {value: "제목", label: "제목"},
        {value: "작성자", label: "작성자"}
    ];

    const search = {
        optionName: options[0].label, // options[0]는 (options) 첫 번째 원소를 나타내며, .label은 해당 원소의 label 속성을 가리킴
        searchValue: ""
    }

    const [ searchParams, setSearchParams ] = useState(search);

    // 배열은 쿼리의 고유key값, "getBoardList"와 현재 페이지 번호 (page) 및 카테고리 (category)로 구성
    const getBoardList = useQuery(["getBoardList", page, category], async () => { 
        const option = { // option 객체를 만들고, 그 안에 params 키로 searchParams 변수를 할당합니다. 이 객체는 HTTP 요청 옵션을 정의
            params: searchParams
        }
        return await instance.get(`/boards/${category}/${page}`, option) //  동적으로 생성
    }, {
        refetchOnWindowFocus: false // useQuery의 옵션 객체의 일부로, 창이 포커스를 얻었을 때 자동으로 데이터를 다시 가져오지 않도록 설정
    });

    const getBoardCount = useQuery(["getBoardcount", page, category], async () => { 
        const option = {
            params: searchParams
        }
        return await instance.get(`/boards/${category}/count`, option)
    }, {
        refetchOnWindowFocus: false
    });

    const handleSearchInputChange = (e) => {
        setSearchParams({
            ...searchParams,
            searchValue: e.target.value // searchValue 속성(새로운값)을 e.target.value로 업데이트
        })
    }

    const handleSearchOptionSelect = (option) => {
        setSearchParams({
            ...searchParams,
            optionName: option.label
        })
    }

    const handleSearchButtonClick = () => { // 검색이 되면 1번페이지가 되면서 나타나야 한다.
        navigate(`/board/${category}/1`) // 진짜 페이지가 바뀌는 것이 아닌 부분 렌더링이 일어나는 것
        getBoardList.refetch(); // refetch 메서드를 사용하여 데이터를 다시 불러오는 것
        getBoardCount.refetch();
    }

    const pagination = () => {
        if(getBoardCount.isLoading) {
            return <></> // 만약 데이터를 아직 불러오고 있는 중이라면, 렌더링 결과로 빈 값 반환
        }

        const totalBoardCount = getBoardCount.data.data;

        const lastPage = totalBoardCount % 10 === 0
            ? totalBoardCount / 10
            : Math.floor(totalBoardCount / 10) + 1 // 10으로 나누어 떨어지지 않으면 1페이지를 더 생성시킴

            // 5로 나누었을  나머지 값이 시작index값이 0인  page - 4경우, 1인 경우 page - (page % 5) + 1 
            const startIndex = parseInt(page) % 5 === 0 ? parseInt(page) - 4 : parseInt(page) - (parseInt(page) % 5) + 1;

            const endIndex = startIndex + 4 <= lastPage ? startIndex + 4 : lastPage; // 7보다 작거나 같은경우

            const pageNumbers = [];

            for(let i = startIndex; i <= endIndex; i++) {
                pageNumbers.push(i);
            }

            return (
                <>
                    <button disabled={parseInt(page) === 1} onClick={() => {
                        navigate(`/board/${category}/${parseInt(page) - 1}`);
                    }}>&#60;</button>

                    {pageNumbers.map(num => {
                        return <button key={num} onClick={() => {
                            navigate(`/board/${category}/${num}`)
                        }}>{num}</button>
                    })}

                    <button disabled={parseInt(page) === lastPage} onClick={() => {
                        navigate(`/board/${category}/${parseInt(page) + 1}`);
                    }}>&#62;</button>
                </>
            )
    }

    return (
        <RootContainer>
            <div>
                <h1>{category === "all" ? "전체 게시글" : category}</h1>

                <div css={searchContainer}>
                    <div css={selectBox}>
                        <ReactSelect 
                            options={options} 
                            defaultValue={options[0]} 
                            onChange={handleSearchOptionSelect} />
                    </div>
                    <input type="text" onChange={handleSearchInputChange} />
                    <button onClick={handleSearchButtonClick}>검색</button>
                </div>
                <table css={table}>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th>추천</th>
                            <th>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!getBoardList.isLoading && getBoardList?.data?.data.map(board => {
                            return <tr key={board.boardId} 
                                onClick={() => {navigate(`/board/${board.boardId}`)}}>
                                        <th>{board.boardId}</th>
                                        <th css={SBoardTitle}>{board.title}</th>
                                        <th>{board.nickname}</th>
                                        <th>{board.createDate}</th>
                                        <th>{board.likeCount}</th>
                                        <th>{board.hitsCount}</th>
                                    </tr>
                        })}
                        
                    </tbody>
                </table>

                <div css={SPageNumbers}>
                    {pagination()}
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardList;