import { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/logo.png";
import "./header.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Root/RootReducer";
import NotificationBell from "../../Notification/NotificationBell";

type HeaderProps = {
  onToggleSidebar: () => void;
  medicationId?: number; // ID do medicamento selecionado
};

export default function Header({ onToggleSidebar, medicationId }: HeaderProps) {
  const menuRef = useRef<Menu | null>(null);
  const toastRef = useRef<Toast | null>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";

  const menuItems = [
    { label: "Dashboard", icon: "pi pi-home", command: () => navigate("/dashboard") },
    { label: "Medicamentos", icon: "pi pi-list", command: () => navigate("/medications/list") },
    { 
      label: "Agendamentos", 
      icon: "pi pi-clock", 
      command: () => {
        if (medicationId) navigate(`/medications/${medicationId}/schedules`);
        else toastRef.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'Selecione um medicamento para ver os agendamentos', life: 3000 });
      } 
    },
    { label: "Usuários", icon: "pi pi-users", command: () => navigate("/usuarios") },
    { label: "Perfil", icon: "pi pi-user", command: () => navigate("/profile") },
    { label: "Suporte", icon: "pi pi-question", command: () => navigate("/private/suport") }
  ];

  return (
    <>
      <Toast ref={toastRef} />

      <header className="w-full flex justify-content-between align-items-center px-4 py-2 surface-border surface-0 h-4rem shadow-5 mb-3 navbar">
        <div className="flex align-items-center gap-8">
          <img src={img} alt="logo" className="navbar-logo" />

          <Button
            icon="pi pi-bars"
            className="p-button-text p-2 hidden lg:block xl:block"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
          />

          <Sidebar visible={visible} onHide={() => setVisible(false)}>
            <h2>Menu</h2>
            <ul className="menu-list">
              {menuItems.map(item => (
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

          <Button
            icon="pi pi-bars"
            onClick={() => setVisible(true)}
            className="p-button-text p-2 lg:hidden xl:hidden"
            aria-label="Open Sidebar"
          />
        </div>

        <NotificationBell userId={userId} />

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {menuItems.map(item => (
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

          <div className="block md:hidden">
            <Button
              icon="pi pi-ellipsis-v"
              className="p-button-text p-0"
              onClick={(e) => menuRef.current?.toggle(e)}
              aria-haspopup
              aria-controls="popup_menu"
              aria-label="Menu"
            />
            <Menu model={menuItems} popup ref={menuRef} id="popup_menu" className="navbar" />
          </div>
        </div>
      </header>
    </>
  );
}
