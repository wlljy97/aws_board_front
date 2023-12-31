import { Route, Routes, useNavigate } from "react-router-dom";
import RootLayout from "./components/RootLayout/RootLayout";
import Home from "./pages/Home/Home";
import { useQuery } from "react-query";
import { instance } from "./api/config/instance";
import AuthRoute from "./components/Routes/AuthRoute";
import AccountRoute from "./components/Routes/AccountRoute";
import BoardWrite from "./pages/BoardWrite/BoardWrite";
import BoardList from "./pages/BoardList/BoardList";
import BoardDetails from "./pages/BoardDetails/BoardDetails";
import Store from "./pages/Store/PointStore";
import BoardEdit from "./pages/BoardEdit/BoardEdit";

function App() {

  // useQuery는 get요청
  const getPrincipal = useQuery(["getPrincipal"], async () => { // 첫번째는 key값, 두번째는 비동기 처리 , ["getPrincipal(키값)", (dependency)]
    try{
      const option = {
        headers: {
          Authorization: localStorage.getItem("accessToken")
        }
      }
      return await instance.get("/account/principal", option); // /account 시작되어서 filter가 동작되어야 한다.
      // getprincipal 안에 응답데이터를 받아온다.

    } catch (error){
        throw new Error(error);
    }
    }, {
      retry: 0, // 요청실패 했을때 다시 요청 몇번 날릴것인가
      refetchInterval: 1000 * 60 * 10, // 10분 마다 다시 요청을 날림 -> await instance.get("/account/principal", option)
      refetchOnWindowFocus: false // 맨처음 렌더링 될때 요청 날림
      
    }); 

  if(getPrincipal.isLoading) {
    return <></>
  }

  return (
    <>
    <RootLayout>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/auth/*" element={ <AuthRoute/> }/>     {/*  auth/* 서브 라우터  */}
        <Route path="/account/*" element={ <AccountRoute/> }/>
        <Route path="/board/write" element={ <BoardWrite/> }/>
        <Route path="/board/:category/:page" element={ <BoardList/> }/>
        <Route path="/board/:boardId" element={ <BoardDetails /> } />
        <Route path="/board/edit/:boardId" element={ <BoardEdit/> }/>
        <Route path="/store/products" element={ <Store />} />

      </Routes>
    </RootLayout>
    </>
  );
}

export default App;
