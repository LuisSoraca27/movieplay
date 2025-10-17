import axios from "axios";

// const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development'

// const baseURL = NODE_ENV === 'development' ? import.meta.env.VITE_URLDEV : import.meta.env.VITE_URLPROD
 const baseURL = "https://web-di72og4j1xut.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/v1/"
  // const baseURL = "http://localhost:4002/api/v1/"
const dksoluciones = axios.create({
    baseURL,
});

export default dksoluciones;