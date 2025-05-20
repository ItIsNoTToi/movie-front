import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const RequireAdmin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role") || "{}");

    if (!role || role !== "Admin") {
      window.location.href='/';
      navigate("/"); // Chuyển hướng nếu không phải admin
    }
  }, []);

  return <Outlet />;
};

export default RequireAdmin;
