import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import RootLayout from "./components/RootLayout/RootLayout";
import Home from "./pages/Home/Home";
import { useQuery } from "react-query";
import { instance } from "./api/config/instance";
import { loginRecoilState } from "./store/atoms/AuthAtoms";
import { useRecoilState } from "recoil";

function App() {

  const navigate = useNavigate();

  const getPrincipal = useQuery("getPrincipal", async () => { // 첫번째는 key값, 두번째는 비동기 처리
    try{
      const option = {
        headers: {
          Authorization: localStorage.getItem("accessToken")
        }
      }
      return await instance.get("/account/principal", option); // /account 시작되어서 filter가 동작되어야 한다.

    } catch (error){
        throw new Error(error);
    }
    }, {
      retry: 0,
      refetchInterval: 1000 * 60 * 10, // 10분 마다 다시 요청을 날림
      refetchOnWindowFocus: false,

      // onSuccess: (response) => { // 정상적이면 success
      //   if(!response.data.enabled) { // 이메일 인증이 되지 않음

      //   }
      // },
      // onError: (error) => { // 정상적이지 않으면 error
      //   console.log(error);
      // }
      
    }); 

  

  return (
    <>
    <RootLayout>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/auth/*" element={ <Auth/> }/>          {/*  auth/* 서브 라우터  */}
        <Route path="/board/:category" element={<></>}/>
        <Route path="/board/:category/register" element={<></>}/>
        <Route path="/board/:category/edit" element={<></>}/>
      </Routes>
    </RootLayout>
    </>
  );
}

export default App;
