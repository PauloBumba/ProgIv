import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginExternal } from "../../Reducers/UserReducer";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch } from "../../Store/StoreReducer";

export const AuthCallback = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const login = async () => {
      try {
        const resultAction = await dispatch(loginExternal(token) as any);
        if (loginExternal.fulfilled.match(resultAction)) {
          navigate("/dashboard");
        } else {
          console.error("Erro no login externo:", resultAction.payload);
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    login();
  }, [dispatch, location, navigate]);

  return <div>Processando login...</div>;
};
