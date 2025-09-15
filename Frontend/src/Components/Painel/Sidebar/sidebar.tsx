import { classNames } from "primereact/utils";
import { SpeedDial } from "primereact/speeddial";
import { useNavigate } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
import "./sidebar.css";

type SidebarProps = {
  isCollapsed: boolean;
  setHovered: (value: boolean) => void;
  medicationId?: number;
};

export default function Sidebar({ isCollapsed, setHovered, medicationId }: SidebarProps) {
  const navigate = useNavigate();
  const isExpanded = !isCollapsed;

  // Menu principal
  const mainMenu = [
    { label: "Dashboard", icon: "pi pi-home", command: () => navigate("/dashboard") },
    { label: "Medicamentos", icon: "pi pi-list", command: () => navigate("/medications/list") },
    { 
      label: "Agendamentos", 
      icon: "pi pi-clock", 
      command: () => {
        if (medicationId) navigate(`/medications/${medicationId}/schedules`);
        else console.warn("Selecione um medicamento para ver os agendamentos");
      } 
    },
    { label: "Usuários", icon: "pi pi-users", command: () => navigate("/usuarios") },
    { label: "Suporte", icon: "pi pi-question", command: () => navigate("/private/suport") },
  ];

  // Itens do SpeedDial (parte inferior)
  const bottomActions = [
    { label: "Perfil", icon: "pi pi-user", command: () => navigate("/profile") },
    { label: "Sair", icon: "pi pi-sign-out", command: () => { 
      localStorage.clear();
      navigate("/login"); 
    }},
  ];

  // Ajuste do menu para o PanelMenu (com submenus, se necessário)
  const panelMenuItems = mainMenu.map(item => ({
    label: isExpanded ? item.label : "",
    icon: item.icon,
    command: item.command,
    tooltip: item.label
  }));

  return (
    <aside
      className={classNames(
        "sidebar custom-scrollbar sidebar-transition hidden lg:flex flex-column justify-between",
        { "sidebar-expanded": isExpanded, "sidebar-collapsed": !isExpanded }
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Parte superior com menu */}
      <div className="flex flex-column p-3">
        {isExpanded && <h2 className="text-lg font-bold mt-2 mx-auto">Menu</h2>}
        <PanelMenu model={panelMenuItems} className="w-full p-2" />
      </div>

      {/* Parte inferior com SpeedDial */}
      <div className="mb-2">
        <SpeedDial
          model={bottomActions}
          direction="up"
          style={{ left: "50%", transform: "translateX(-50%)", bottom: 5 }}
          aria-label="Ações rápidas"
        />
      </div>
    </aside>
  );
}
