import axios from "axios";

// axios.create는 전역에다가 공동 설정 부분
// 외부에도 쓸수있게끔 'export'를 선언
export const instance = axios.create({ 
    baseURL: "http://localhost:8080"
});