import { classNames } from "primereact/utils";
import { SpeedDial } from "primereact/speeddial";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import { PanelMenu } from "primereact/panelmenu";

type SidebarProps = {
  isCollapsed: boolean;
  setCollapsed?: (value: boolean) => void;
  setHovered: (value: boolean) => void;
};

export default function Sidebar({ isCollapsed, setHovered }: SidebarProps) {
  const isExpanded = !isCollapsed;
  const navigate = useNavigate();

  const menuItems = [
    {
      label: isExpanded ? "Dashboard" : " ",
      icon: "pi pi-home",
      tooltip: "Dashboard",
      command: () => navigate("/dashboard"),
      items: [
        {
          label: isExpanded ? "Listar Usuários" : "",
          icon: "pi pi-users",
          command: () => navigate("/usuarios"),
          className: "my-2",
        },
        {
          label: isExpanded ? "Novo Usuário" : "",
          icon: "pi pi-user-plus",
          command: () => navigate("/usuarios/criar"),
          className: "my-2",
        },
      ],
    },
    {
      label: isExpanded ? "Solicitações de Despesas" : "",
      icon: "pi pi-file",
      command: () => navigate("/expense"),
      className: "my-2",
    },
    {
      label: isExpanded ? "Configurações" : "",
      icon: "pi pi-cog",
      command: () => navigate("/configuracoes"),
      className: "my-2",
    },
  ];

  const items = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => {
        navigate("/profile");
      },
    },
    {
      label: "Sair",
      icon: "pi pi-sign-out",
      command: () => {
        // Aqui pode adicionar lógica de logout, tipo limpar token e redirecionar
        console.log("Logout executado");
        navigate("/login");
      },
    },
  ];

  return (
    <aside
      className={classNames(
        "sidebar custom-scrollbar sidebar-transition hidden lg:flex flex-column justify-between",
        {
          "sidebar-expanded": isExpanded,
          "sidebar-collapsed": !isExpanded,
        }
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Parte superior com menus */}
      <div className="flex flex-column">
        {isExpanded && (
          <h2 className="text-lg font-bold mt-2 mx-auto" style={{ userSelect: "none" }}>
            Menu
          </h2>
        )}

        <div className="p-3 flex flex-column h-full justify-between">
          <PanelMenu model={menuItems} className="w-full p-2" />
        </div>
      </div>

      {/* Parte inferior com SpeedDial */}
      <div className="mb-2">
        <SpeedDial
          model={items}
          direction="up"
          style={{ left: "calc(50% - 2rem)", bottom: 5 }}
          aria-label="SpeedDial Actions"
        />
      </div>
    </aside>
  );
}
