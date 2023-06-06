import axios from "axios";

const instance = axios.create({
    baseURL: "https://atna-menr-api.onrender.com",
});

export default instance;
