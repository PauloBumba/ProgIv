import { type FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../Root/RootReducer";
import { logout } from "../../Reducers/UserReducer";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";

export const Profile: FC = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    confirmDialog({
      message: 'Tem certeza que deseja sair?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        dispatch(logout());
        navigate("/login");
      },
    });
  };

  if (!user) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#2196F3' }}></i>
      </div>
    );
  }

  const roleColor = user.role === 'Admin' ? 'red' : 'blue';

  return (
    <>
      <ConfirmDialog visible={visible} onHide={() => setVisible(false)} />
      <div className="flex justify-content-center mt-6 px-3 animate__animated animate__fadeIn">
        <Card 
          title={`Perfil do Usuário: ${user.nome}`} 
          subTitle={user.email}
          className="w-full md:w-6"
          style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
        >
          <Divider />

          <div className="flex flex-column items-center mb-4 gap-3">
            {/* Foto genérica */}
            <img
              src={`https://ui-avatars.com/api/?name=${user.nome}&background=2196F3&color=fff&size=128`}
              alt="avatar"
              className="rounded-full shadow-md"
            />
            <Tag value={user.role} severity={roleColor === 'red' ? 'danger' : 'info'} rounded />
          </div>

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
    </>
  );
};
