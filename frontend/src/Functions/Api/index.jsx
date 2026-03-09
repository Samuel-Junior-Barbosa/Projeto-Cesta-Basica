import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 10000
});

// 🔐 interceptor de request (envia token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }


  return config;
});

// 🚨 interceptor de resposta (token inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    //console.log("RESPONSE: ", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;