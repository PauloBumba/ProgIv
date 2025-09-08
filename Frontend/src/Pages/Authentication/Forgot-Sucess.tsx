
import { Button } from "primereact/button";
import{Link} from "react-router-dom";
export const ForgotToPassordSucess = ()=>{
   
    return(
       <div className="my-5 p-2 mx-4 text-center glass border-2 p-5 border-round-2xl layouts border-bottom-2 form-login shadow-8 ">
          
          <span className="pi pi-envelope text-7xl my-3 nav"> </span>
                <h1 className="nav mb-2">Recuperação de senha</h1>
                <p className="mb-4 text-center mx-5 nav">
                    Se você possui uma conta connosco , enviaremos um e-mail com as instruções para reinicar sua senha
                </p>
                <Link to="/otp" >
                <Button label="Clica para confirmar o codígo recebido no email" className="p-button-mobile"/>
            </Link>
           
            
       </div> 

    )
}