// src/hooks/useAuth.ts
const useAuth = () => {
  const token = JSON.parse(localStorage.getItem("token") || "null");
  return { token, isLoggedIn: !!token };
};

export default useAuth;
