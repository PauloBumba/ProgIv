import { useSelector } from "react-redux";
import { type RootState } from "../Root/RootReducer";
import { Navigate } from "react-router-dom";
import React from "react";

interface PropsChildren {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// Tipo unificado para ambos os slices
interface AuthUser {
  id?: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  isAuthenticated: boolean;
}

export const PrivateRoute = ({ children, requiredRoles }: PropsChildren) => {
  const normalUser = useSelector((state: RootState) => state.users.user);
  const extraUser = useSelector((state: RootState) => state.extraLogin);

  // Cria user unificado com isAuthenticated
  let user: AuthUser | null = null;

  if (normalUser) {
    user = {
      id: normalUser.id,
      email: normalUser.email,
      fullName: normalUser.nome,
      roles: normalUser.role as any || [],
      isAuthenticated: true, // assume que se tem normalUser, está autenticado
    };
  } else if (extraUser?.isAuthenticated) {
    user = {
      id: extraUser.id,
      email: extraUser.email,
      fullName: extraUser.fullName,
      roles: extraUser.roles || [],
      isAuthenticated: true,
    };
  }

  console.log("Normal User:", normalUser);
  console.log("Extra User:", extraUser);
  console.log("Usuário escolhido:", user);

  if (!user) {
    console.log("Nenhum usuário logado. Redirecionando para /login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = requiredRoles.some(r => user!.roles!.includes(r));
    console.log("Roles do usuário:", user.roles);
    console.log("Roles exigidos:", requiredRoles);

    if (!hasRole) {
      console.log("Usuário não possui roles exigidos. Redirecionando para /nao-autorizado");
      return <Navigate to="/nao-autorizado" replace />;
    }
  }

  console.log("Usuário autorizado. Renderizando children.");
  return <>{children}</>;
};
