import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../Api/api";
import { setUser } from "../../Reducers/ExtraloginReducer";
import { Message } from "primereact/message";
import type { RootState } from "../../Root/RootReducer";
import { ApiErrorHelper } from "../../Helper/apihelper";

export const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const userState = useSelector((state: RootState) => state.extraLogin);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Pega usuário autenticado via cookie
        const response = await api.get("https://localhost:7184/auth/me", {
          withCredentials: true, // MUITO IMPORTANTE para cookies cross-site
        });

        const user = response.data?.data; // pega o .data do envelope

        if (user && user.id) {
          dispatch(setUser(user));       // atualiza Redux
          navigate("/dashboard");        // só navega se tiver user
        } else {
          navigate("/login");           // fallback
        }
      } catch (err: any) {
        console.error(err);
        setError(ApiErrorHelper.extractErrorMessage(err));
        navigate("/login");             // fallback
      }
    };

    // Só busca se não tiver user no Redux
    if (!userState.isAuthenticated) {
      fetchUser();
    } else {
      navigate("/dashboard");
    }
  }, [dispatch, navigate, userState.isAuthenticated]);

  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen">
      <Message severity={error ? "error" : "info"} text={error || "Autenticando, aguarde..."} />
    </div>
  );
};
