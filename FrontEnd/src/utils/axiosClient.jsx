import axios from 'axios'
const BackendUrl= import.meta.env.VITE_BACKEND_URL;
const axiosClient = axios.create({
    baseURL:BackendUrl|| 'http://localhost:3000',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
});
export default axiosClient