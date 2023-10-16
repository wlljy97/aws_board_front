import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */

const rootContainer = css`
    display: flex;
    width: 100%;
    height: 100%;
`;

const mainContainer = css`
    flex-grow: 1;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
`;

function RootContainer({ childern }) {
    return (
        <div css={rootContainer}>
            <Sidebar />
            <div css={mainContainer}>
                {childern}
            </div>
        </div>
    );
}

export default RootContainer;