import axios from "axios";

const api = axios.create({
  baseURL: "https://djangobackend-1-lr35.onrender.com",

});

export default api;