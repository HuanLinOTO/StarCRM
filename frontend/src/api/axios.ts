import axios from "axios";
const instance = axios.create({
    baseURL: import.meta.env.DEV ? "http://localhost:3000/api": "/api",
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});
export default instance
