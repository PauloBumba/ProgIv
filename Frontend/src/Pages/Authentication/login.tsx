import {type FC, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";
import { Message } from "primereact/message";  // Importando o Message do PrimeReact
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginExternal, loginUser } from "../../Reducers/UserReducer";
import { useDispatch } from "react-redux";
import { useProgressOverlay } from "../../Components/ProgressBar/useProgressOverlay";
import { ApiErrorHelper } from "../../Helper/apihelper";

import { useSelector } from "react-redux";
import type { RootState } from "../../Root/RootReducer";

import { SocialLoginButton } from "../../Utils/SocialLoginButton";


export const Login: FC = () => {
  const { ProgressOverlay, show, hide } = useProgressOverlay();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const lastPath = useSelector((state: RootState) => state.route.lastPath) || "/dashboard";

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  show();
  setLoading(true);
  setError(null);

  try {
    const resultAction = await dispatch(loginUser({ email, password }) as any);

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/dashboard");
      
    } else if (loginUser.rejected.match(resultAction)) {
      const errorMessage = ApiErrorHelper.extractErrorMessage(resultAction.payload);
      setError(errorMessage);
    }
  } catch (err) {
    setError(ApiErrorHelper.extractErrorMessage(err));
  } finally {
    hide();
    setLoading(false);
  }
};


  

  return (
    <div className="flex justify-content-center align-items-center border">
      <form
        onSubmit={handleLogin}
        className="card border-2 p-5 border-round-2xl layouts border-bottom-2 form-login shadow-8 glass"
        autoComplete="on"
      >
        <div className="text-center">
          <h3 className="mb-3 text-3xl text-white font-light">Entre com</h3>
          <div>
          <div className="flex justify-content-center mt-4">
          <SocialLoginButton icon="pi pi-google" provider="Google" severity="danger" />
          <SocialLoginButton icon="pi pi-facebook" provider="Facebook" severity="info" />
           
          </div>

         
          <div className="flex justify-content-center mt-4">
           
          </div>


            <div className="my-3 max-w-screen">
              <hr />
            </div>
            <h3 className="text-3xl mb-2 text-white font-light">ou</h3>
          </div>
        </div>
        <div className="mb-4 mx-auto flex justify-content-center  ">
        {error && <Message severity="error" text={error} />}
        </div>
       {/* Exibe mensagem de erro com PrimeReact */}

        <div className="mb-3">
          <div className="p-inputgroup mb-3">
            <span className="p-inputgroup-addon pi pi-envelope pi-phone"></span>
            <InputText
              id="email"
              placeholder="Informe seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              keyfilter={"email"}
            />
          </div>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon pi pi-lock"></span>
            <Password
              id="password"
              placeholder="Informe sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
             
            />
          </div>
          <div className="text-center mb-3">
            <div className="my-3 flex align-items-center justify-content-center">
              <InputSwitch
               readOnly
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.value)}
              />
              <label className="mt-2 ml-2 nav">Lembrar de mim</label>
            </div>
            <div>
              <Link to="/forgot" className="underline nav">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
          <div>
              <ProgressOverlay />
              </div>
          <div>
            <Button type="submit" label="Entrar" className="w-full p-button-mobile" loading={loading} />
          </div>
        </div>
        <div className="text-center">
          <h3>Não tem uma conta?</h3>
          <Link to="/usuarios/criar" className="underline nav">Cadastre-se</Link>
        </div>
      </form>
    </div>
  );
};
