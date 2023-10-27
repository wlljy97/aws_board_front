import React, { useEffect } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { css } from '@emotion/react';
import { useQuery, useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
/** @jsxImportSource @emotion/react */

const SStoreContainer = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;

`;

const SProductContainer = css`
    margin: 10px;
    width: 30%;
    height: 120px;
    cursor: pointer;
`;

function PointStore(props) {
    const queryClient = useQueryClient();

    const getProducts = useQuery(["getProducts"], async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            return await instance.get("/products", option);
        } catch(error) {

        }
    });

    useEffect(() => {
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
        document.head.appendChild(iamport);
        return () => { // return에 걸어주면 unmount
            document.head.removeChild(iamport);
        }
    }, [])

    const handlePaymentSubmit = (product) => {
        const principal = queryClient.getQueryState("getPrincipal");
        if(!window.IMP) {return;}
        const { IMP } = window;
        IMP.init("imp52230315"); // IMP 초기화를 시킴

        const paymentData = {
            pg: "kakaopay",
            pay_method: "kakaopay",
            merchant_uid: `mid_${new Date().getTime()}`,
            amount: product.productPrice,
            name: product.productName,
            buyer_name: principal?.data?.data.name,
            buyer_email: principal?.data?.data.email
        }

        // 최종적으로 이 구문이 실행이 되면 됨
        IMP.request_pay(paymentData, (response) => { // 응답 데이터인 paymentData가 response로 들어감
            const { success, error_msg } = response;

            if(success) {
                const orderDate = {  // 우리 서버에 주문 데이터 insert
                    productId: product.productId,
                    email: principal?.data?.data.email
            }
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            } 
            instance.post("/order", orderDate, option).then(response => {
                alert("포인트 충전이 완료되었습니다.");
                // queryClient.refetchQueries([""]);
            })
        } else {
                alert(error_msg);
            }
        });
    }

    return (
        <RootContainer>
            <h1>포인트 충전하기</h1>
            <div css={SStoreContainer}>
                {!getProducts.isLoading && getProducts?.data?.data.map(product => {
                    return <button key={product.productId} css={SProductContainer} 
                                onClick={() => {handlePaymentSubmit(product);}}>  {/* 클릭 시 마다 다른 상품 */}
                                {product.productName} Point
                            </button>
                })}
            </div>
        </RootContainer>
    );
}

export default PointStore;