import axios from 'axios'
const BackendUrl= import.meta.env.VITE_BACKEND_URL;
const axiosClient = axios.create({
    baseURL:"https://codeloom-backend-3pj7.onrender.com",
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    }
});
export default axiosClient