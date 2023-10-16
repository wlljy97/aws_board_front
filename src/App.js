import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import RootLayout from "./components/RootLayout/RootLayout";
import Home from "./pages/Home/Home";

function App() {
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
