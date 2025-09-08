import { useSelector } from "react-redux";
import { type RootState } from "../Root/RootReducer";
import { Navigate } from "react-router-dom";
import React from "react";
import type { Roles } from "../Constants/roles";
interface PropsChildren {
  children: React.ReactNode;
  requiredRoles?: string[]; // agora aceita vários roles
}

export const PrivateRoute = ({ children, requiredRoles }: PropsChildren) => {
  const user = useSelector((state: RootState) => state.users.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.IsAuthetications) {
    return <Navigate to="/nao-autorizado" replace />;
  }

  console.log("Role do usuário:", user.role);
console.log("Roles exigidos:", requiredRoles);


if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
  return <Navigate to="/nao-autorizado" replace />;
}



  return <>{children}</>;
};
