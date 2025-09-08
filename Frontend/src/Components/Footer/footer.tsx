import { Link } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ButtonGroup } from "primereact/buttongroup";
import { Button } from "primereact/button";
import "./footer.css"
export const Footer= () => {
  return (
    <footer className="footer-custom bottom-0 static navbar-custom ">
      <div className="grid">
        {/* Coluna 1 - Cardápio */}
        <div className="col-12 md:col-6 lg:col-4 text-center md:text-left ">
          <h3 className="">Cardápio Online</h3>
          <Link to="/term-use" className="block text-decoration-none nav  mx-3">Termo de uso</Link>
          <Link to="/about" className="block text-decoration-none mt-2 nav  mx-5" >Equipe</Link>
        </div>
        
      

        {/* Coluna 2 - Suporte */}
        <div className="col-12 md:col-6 lg:col-4 text-center md:text-left link">
          <h3 className="">Feedback e Suporte</h3>
          <Link to="/suport" className="block text-decoration-none nav  mx-3"> Suporte e Contato</Link>
          <Link to="/feedback" className="block text-decoration-none mt-2 nav  mx-6">Avaliações</Link>
        </div>
       


        {/* Coluna 3 - Redes Sociais */}
        <div className="col-12 lg:col-4 text-center">
          <h3 className="">Siga-nos nas Redes Sociais</h3>
          <div className="flex justify-content-center mt-3">
<ButtonGroup >
    <Button
      outlined
      icon="pi pi-facebook"
      className="border-2 w-6rem p-button-facebook p-button-warning"
    />
    <Button
      outlined
      icon="pi pi-instagram"
      className="border-2 w-6rem p-button-instagram  p-button-warning"
    />
    <Button
      outlined
      icon="pi pi-linkedin"
      className="border-2 w-6rem p-button-warning p-button-linkedin "
    />
  </ButtonGroup>
</div>

  
        </div>
      </div>
    </footer>
  );
};
