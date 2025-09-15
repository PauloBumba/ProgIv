import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLastPath } from "../Reducers/routeSlice";

export const RouteWatcher = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Salva no redux toda vez que a rota mudar
    dispatch(setLastPath(location.pathname));
  }, [location, dispatch]);

  return null; // não renderiza nada
};
