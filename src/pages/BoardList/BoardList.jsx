import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
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
    margin-bottom: 20px;
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
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    width: 200px;
    list-style-type: none;
    & a {
        text-decoration: none;
        color: black;
    }

    & li {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        border: 1px solid #dbdbdb;

    }
`;

function BoardList(props) {

    const { category, page } = useParams();
    console.log(category);

    const options = [
        {value: "전체", label: "전체"},
        {value: "제목", label: "제목"},
        {value: "작성자", label: "작성자"}
    ];

    const [ boardList, setBoardList ] = useState([]);

    const getBoardList = useQuery(["getBoardList", page, category], async () => {
        const option = {
            params: {
                optionName: "",
                searchValue: ""
            }
        }
        return await instance.get(`/boards/${category}/${page}`, option)
    })

    return (
        <RootContainer>
            <div>
                <h1>{category === "all" ? "전체 게시글" : category}</h1>

                <div css={searchContainer}>
                    <div css={selectBox}>
                        <ReactSelect options={options} defaultValue={options[0]}/>
                    </div>
                    <input type="text" />
                    <button>검색</button>
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
                            return <tr key={board.boardId}>
                                        <th>{board.boardId}</th>
                                        <th>{board.title}</th>
                                        <th>{board.nickname}</th>
                                        <th>{board.createDate}</th>
                                        <th>{board.hitsCount}</th>
                                        <th>{board.likeCount}</th>
                                    </tr>
                        })}
                        
                    </tbody>
                </table>

                <ul css={SPageNumbers}>
                    <Link to={`/board/${category}/${page - 1}`}><li>&#60;</li></Link> 

                    <Link to={`/board/${category}/${1}`}><li>1</li></Link> 
                    <Link to={`/board/${category}/${2}`}><li>2</li></Link> 
                    <Link to={`/board/${category}/${3}`}><li>3</li></Link> 
                    <Link to={`/board/${category}/${4}`}><li>4</li></Link> 
                    <Link to={`/board/${category}/${5}`}><li>5</li></Link> 

                    <Link to={`/board/${category}/${parseInt(page) + 1}`}><li>&#62;</li></Link> 
                </ul>
            </div>
        </RootContainer>
    );
}

export default BoardList;