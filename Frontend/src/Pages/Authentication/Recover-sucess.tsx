
import { Button } from "primereact/button";
import{Link} from "react-router-dom";
export const RecoverToPassordSucess = ()=>{
   
    return(
       <div className="glass text-center border-2 p-5 border-round-2xl layouts border-bottom-2 form-login shadow-8 ">
          
            
            <span className="pi pi-envelope text-7xl mt-3 nav "> </span>
                <h1 className="nav">Senha alterada</h1>
                <p className="mb-4 text-center mx-5 nav">
                   Sua senha foi alterada com sucesso .Tente fazer o login novamente
                </p>
                <Link to="/login" >
                <Button label="Voltar ao Login" className="p-button-mobile"/>
            </Link>
          
            
       </div> 

    )
}