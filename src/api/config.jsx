import axios from "axios";

// const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development'

// const baseURL = NODE_ENV === 'development' ? import.meta.env.VITE_URLDEV : import.meta.env.VITE_URLPROD
 const baseURL = "https://servidor-movieplay-production.up.railway.app/api/v1/"
 //  const baseURL = "http://localhost:4002/api/v1/"
const dksoluciones = axios.create({
    baseURL,
});

export default dksoluciones;