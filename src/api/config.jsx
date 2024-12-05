import axios from "axios";

const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development'

const baseURL = NODE_ENV === 'development' ? import.meta.env.VITE_URLDEV : import.meta.env.VITE_URLPROD

const dksoluciones = axios.create({
    baseURL,
});

export default dksoluciones;