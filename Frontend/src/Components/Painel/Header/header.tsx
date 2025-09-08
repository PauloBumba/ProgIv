import { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/logo.png";
import "./header.css";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Root/RootReducer";
import { Roles } from "../../../Constants/roles";
import NotificationBell from "../../Notification/NotificationBell";
type HeaderProps = {
  onToggleSidebar: () => void;
  currentUserRoles?: string[]; // Pode ser opcional, porque colocamos valor padrão
};

export default function Header({ onToggleSidebar, currentUserRoles = [] }: HeaderProps) {
  const menuRef = useRef<Menu | null>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
 const  dispatch =useDispatch();
 const user = useSelector((state :RootState)=>state.users.user)
 console.log("Usuário logado:", user);
 const userId = localStorage.getItem("userId") || "";
 ; // ou do JWT
  // Define as opções do menu lateral e do popup, com ícones e rotas
  const menuItems = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => navigate("/dashboard"),
      visible: true,
    },
    {
      label: "Solicitações de Despesas",
      icon: "pi pi-file",
      command: () => navigate("/expense"),
      visible: true,
    },
    {
      label: "Minhas Despesas",
      icon: "pi pi-wallet",
      command: () => navigate("/myexpense"),
      visible: currentUserRoles.includes("Collaborator") || currentUserRoles.includes("Admin"),
    },
    {
      label: "Usuários",
      icon: "pi pi-users",
      command: () => navigate("/usuarios"),
      visible: currentUserRoles.includes("Admin") || currentUserRoles.includes("Manager"),
    },
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => navigate("/usuarios"),
      visible: true,
    },
   {
  label: "Configurações",
  icon: "pi pi-cog",
 command: () => {
  if (user?.role === Roles.Collaborator) {
    navigate("/myexpense");
  } else if (user?.role === Roles.Admin) {
    navigate("/createexpense");
  } else {
    navigate("/acesso-negado");
  }   
 visible: [Roles.Admin, Roles.Collaborator].includes(user!.role as Roles)


 },
    
   visible: [Roles.Admin, Roles.Collaborator].includes(user!.role as Roles) 
}];

  // Filtra itens que estão visíveis para o usuário
  const filteredMenuItems = menuItems.filter((item) => item.visible);

  return (
    <header className="w-full flex justify-content-between align-items-center px-4 py-2 surface-border surface-0 h-4rem shadow-5 mb-3 navbar">
      {/* Esquerda: Logo + botão do sidebar */}
      <div className="flex align-items-center gap-8  ">
        <img src={img} alt="logo" className="navbar-logo" />

        {/* Botão desktop para sidebar */}
        <Button
          icon="pi pi-bars"
          className="p-button-text p-2 hidden lg:block xl:block"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        />

        {/* Sidebar mobile */}
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <h2>Menu</h2>
          <ul className="menu-list">
            {filteredMenuItems.map((item) => (
              <li key={item.label}>
                <button
                  className="menu-link"
                  onClick={() => {
                    item.command();
                    setVisible(false);
                  }}
                >
                  <i className={`pi ${item.icon} mr-2`}></i>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </Sidebar>

        {/* Botão mobile para abrir sidebar */}
        <Button
          icon="pi pi-bars"
          onClick={() => setVisible(true)}
          className="p-button-text p-2 lg:hidden xl:hidden"
          aria-label="Open Sidebar"
        />
      </div>

      <NotificationBell userId={userId} />

      {/* Direita: botões desktop e menu popup mobile */}
      <div className="flex items-center gap-4">
        {/* Versão Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {filteredMenuItems.map((item) => (
            <Button
              key={item.label}
              icon={item.icon}
              className="p-button-text p-0"
              onClick={item.command}
              aria-label={item.label}
              tooltip={item.label}
              tooltipOptions={{ position: "bottom" }}
            />
          ))}
        </div>

        {/* Versão Mobile: menu popup */}
        <div className="block md:hidden">
          <Button
            icon="pi pi-ellipsis-v"
            className="p-button-text p-0"
            onClick={(e) => menuRef.current?.toggle(e)}
            aria-haspopup
            aria-controls="popup_menu"
            aria-label="Menu"
          />
          <Menu model={filteredMenuItems} popup ref={menuRef} id="popup_menu" className="navbar" />
        </div>
      </div>
    </header>
  );
}
