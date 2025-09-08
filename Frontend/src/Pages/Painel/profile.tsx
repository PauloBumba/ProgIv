import {type FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../Root/RootReducer";
import { logout } from "../../Reducers/UserReducer";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";

export const Profile: FC = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#2196F3' }}></i>
      </div>
    ); // Loader mais moderno
  }

  return (
    <div className="flex justify-content-center mt-6 px-3">
      <Card 
        title={`Perfil do Usuário: ${user.nome}`} 
        subTitle={user.email}
        className="w-full md:w-6"
        style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
      >
        <Divider />

        <div className="mb-4">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <Button
          label="Sair"
          icon="pi pi-sign-out"
          severity="danger"
          onClick={handleLogout}
          className="w-full md:w-auto"
          aria-label="Logout"
        />
      </Card>
    </div>
  );
};
