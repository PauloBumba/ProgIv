
import { Outlet } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/navbar";
import { Footer } from "../../Components/Footer/footer";
import "./public.css";
import "../../Style/global.css"
export const PublicLayot = () => {
    return (
        <div className="layout ">
            <Navbar />
            <main className="content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
