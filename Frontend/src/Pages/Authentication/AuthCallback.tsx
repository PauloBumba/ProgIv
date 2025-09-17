import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../Api/api";
import { setUser } from "../../Reducers/ExtraloginReducer";

export const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("https://localhost:7184/auth/me"); // pega usuário logado
        dispatch(setUser(res.data)); // salva no Redux
        navigate("/dashboard"); // redireciona
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        navigate("/login"); // se falhar, volta para login
      }
    };

    fetchUser();
  }, []);

  return <div>Carregando...</div>;
};
