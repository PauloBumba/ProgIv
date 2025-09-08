import {   useState, type FC, type FormEvent } from "react";
import {Button} from "primereact/button"
import {Password} from "primereact/password"
import { api } from "../../Api/api";
import { useSelector } from "react-redux";
import { type  RootState } from "../../Root/RootReducer";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";
import { ApiErrorHelper } from "../../Helper/apihelper";




export const RecoverToPassword : FC =()=>{
    const [password, setPassword] = useState <string> ();
    const [confirPassword, setPaconfirPassword] = useState <string>();
    const [error ,Seterror] = useState <string> ();
    const user = useSelector((state: RootState) => state.Credential.user);
    const email = user?.email;
    const navigate = useNavigate();
    const token = user?.token;
    
    
    const HandleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (password !== confirPassword) {
    Seterror("As senhas não coincidem");
    setPassword('');
    setPaconfirPassword('');
    return;
  }

  try {
    const response = await api.post("recoverpassword/recover", {
      email,
      token,
      password
    });

    const result = response.data; // aqui pega { message, isSuccess, data }

    if (result.isSuccess) {
      navigate("/reset-sucess");
    } else {
      Seterror(result.message || "Cadastre sua Conta clicando no botão abaixo.");
    }

  } catch (error: any) {
    // Agora usa teu ApiErrorHelper
    const mensagem = ApiErrorHelper.extractErrorMessage(error);
    Seterror(mensagem);
  }
};

    

   
       
    return(
        <div>
        <div className=" mx-8">
        <form action="" method="post" className="glass border-2 p-5 border-round-2xl  form-login shadow-8" onSubmit={HandleSubmit}>
        <div className="text-center">
        <h3>Redefinir  Senha</h3>
      
             
                              {error && (
                                  <div className="my-3">
                                      <Message severity="error" text={error} />
                                  </div>
                              )}
       
        <p className="nav my-3"> Escolha uma senha Segura para sua conta</p>
       <div>
            <div className="p-inputgroup "> 
            <span className="p-inputgroup-addon pi pi-lock"></span>
            <Password id="password" required placeholder="Informa sua senha" onChange={(e)=> setPassword(e.target.value as any) }/>
            </div>
               <div className="p-inputgroup my-3"> 
                     <span className="p-inputgroup-addon pi pi-lock"></span>
                                          
                        <Password id="password" required placeholder="Confirma sua senha" onChange={(e)=>setPaconfirPassword(e.target.value as any)}/>
                                        
                </div>
                <div className="my-5">
                    <Button type="submit" label="Redefinir Senha" className="w-full p-button-mobile"/>
                </div>
              
            </div>
            </div>
        </form>
      </div> 
        </div>
    )
}