import { type FC, type FormEvent, useState } from "react";
import {Button} from "primereact/button"
import {InputText} from "primereact/inputtext"
import { Link, useNavigate} from "react-router-dom"
import {  api } from "../../Api/api";
import { Message } from "primereact/message";
import { useDispatch } from "react-redux";
import { setByEmail } from "../../Reducers/RecoverReducer";


import { useProgressOverlay } from "../../Components/ProgressBar/useProgressOverlay";
import { ApiErrorHelper } from "../../Helper/apihelper";
export const Reset : FC =()=>{
const navigate = useNavigate();
const [email,SetEmail] = useState<string>("")
const [error,SetError] = useState<string>("")
const [mode,SetMode] = useState<boolean>(true)
const { ProgressOverlay, show, hide } = useProgressOverlay();
const validarEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};
 const dispacth = useDispatch ();

 const HandleSubmit = async (e: FormEvent) => {
  e.preventDefault(); // sempre no começo pra evitar comportamento padrão

  if (!validarEmail(email)) {
    SetError("Formato de e-mail inválido.");
    return;
  }

  show();

  try {
    const response = await api.post("RecoverPassword/reset", { email });
    const result = response.data; // pega o envelope todo

    console.log(result);

    if (result.isSuccess) {
      SetMode(true);
      dispacth(setByEmail(email));
      console.log(email) // cuidado com typo: dispatch
      navigate("/forgot-sucess");
    } else {
      SetError(result.message || "Cadastre sua Conta clicando no botão a baixo");
      SetMode(false);
    }
  } catch (error: any) {
    // Aqui vem a mágica: uso do ApiErrorHelper pra extrair mensagem de erro
    const mensagem = ApiErrorHelper.extractErrorMessage(error);
    SetError(mensagem);
  } finally {
    hide();
  }
};



    return (
      <div className="flex justify-content-center align-items-center mx-8">
        <form action="" onSubmit={HandleSubmit} method="post" className=" border-2 p-5 border-round-2xl glass    form-login shadow-8">
        <div className="text-center mb-3">
                <h3>Recuperar Senha</h3>
                <div className="my-3">
                {error && <Message severity="error" text={error} />}
                </div>
                <p className="nav mb-3"> Insira o seu endereço de e-mail para receber instruções de redefinição de senha</p>
               <div>
               <div className="p-inputgroup mb-3 "> 
                    <span className="p-inputgroup-addon pi pi-envelope pi-mail"></span>
                      
                  <InputText id= "email" placeholder="Informe seu email" type="email" required keyfilter={"email"} onChange={(e)=>SetEmail(e.target.value)} />
                           
                       
                                           
               </div>
              <div>
              <ProgressOverlay />
              </div>

          
                <div className="my-5">
                   <Button type="submit" label="Enviar imstruções" className="w-full p-button-mobile"/>
                </div>
                     <div>
                  {mode===true ? (<Link to="/login" className="nav">Voltar para Login</Link>) : (  <Link to="/register" className="nav">Cadastra sua Conta</Link>)}
                  
                </div>
            </div>
            </div>
        </form>
      </div>
    )
}