import "./navbar.css"
import  {  useEffect } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import img from "../../assets/logo.png";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../Root/RootReducer";
import { api } from "../../Api/api";
import { logout } from "../../Reducers/UserReducer";

export const Navbar= () => {
     const navigate = useNavigate();
     const location = useLocation(); 
    const  dispatch =useDispatch();
    const user = useSelector((state :RootState)=>state.users.user?.IsAuthetications)
 
    // Rola até a seção quando o hash da URL mudar
    useEffect(() => {
        if (location.hash) {
            const section = document.querySelector(location.hash);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    // Função para rolar até a seção ou navegar antes
    const handleScrollToSection = (id: string) => {
        if (location.pathname === "/") {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(`/#${id}`); // Muda a URL e depois o useEffect rola a página
        }
    };
    const handleLogout = async() => {
        const response = await api.post("authentication/logout")
        console.log(response.data)
        
        dispatch(logout());  
        navigate("/login"); 
    };
    const items = [
        { 
            label: "Início", icon: "pi pi-home",className: "p-buttons lg:ml-8  ", command: () => {
                if (location.pathname !== "/") navigate("/");
            }
        },
        { label: "Produtos", icon: "pi pi-shopping-cart ",className: "p-buttons   ", command: () => handleScrollToSection("produtos") },
        { label: "Contato", icon: "pi pi-envelope",className: "p-buttons ",command: () => handleScrollToSection("contato") },
        
        {
            label:  user? "Logout" : "Login", // Remova as chaves extras
            icon:user ? "pi pi-sign-out" : "pi pi-sign-in" ,
            className: "p-button-mobile lg:hidden xl:hidden m-2 ",
            command: () =>   user ? handleLogout() : navigate("/login") // Lógica para login/logout
        }
        
        
    ];

    const start = <img src={img} alt="logo" className="navbar-logo" />;

    const end = (
        <div className="flex justify-content-between w-full md:w-auto p-2 text-white ">
         <Link to={user ? "#" : "/login"} className="text-white hover:text-gray-300">
            <Button 
                label={user ? "Logout" : "Login"} 
                icon={user ? "pi pi-sign-out" : "pi pi-sign-in"} 
                className="p-button-rounded p-button-text p-button-mobile hidden lg:inline-flex"
                onClick={() => user ? handleLogout() : navigate("/login")}
            />
        </Link>
        </div>
    );
   

    return (
        <div className="">
            <Menubar model={items} start={start} end={end} className="navbar-custom glass p-3 flex justify-content-around align-items-center sticky  top-0" />
        </div>
    );
};
