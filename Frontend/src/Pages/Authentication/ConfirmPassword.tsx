import  { type FormEvent, useRef, useState } from 'react';


import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast'; // ✅ Toast importado
import { api } from '../../Api/api';
import { useSelector } from 'react-redux';
import {type  RootState } from '../../Root/RootReducer';
import { useNavigate } from 'react-router-dom';
import { setByValidate } from '../../Reducers/RecoverReducer';
import { useDispatch } from 'react-redux';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ApiErrorHelper } from '../../Helper/apihelper';

export default function PasswordRecoveryOTP() {
    const [code, setOtp] = useState<string>('');
    const [error, setError] = useState('');
    const toast = useRef<Toast>(null); // ✅ Toast ref
    const [loading, setLoading] = useState(false);
const [fadeOut, setFadeOut] = useState(false);
    const dispatch = useDispatch();
    const email = useSelector((state: RootState) => state.Credential.user?.email);
    const navigate = useNavigate();

    const HandleSubmit = async (e: FormEvent) => {
        setLoading(true); // Ativa o spinner
        setFadeOut(false); 
        e.preventDefault();

        try {
  const response = await api.post('RecoverPassword/validate', { email, code });
  const result = response.data;

  if (!result) throw new Error("Resposta inválida do servidor.");

  if (result.isSuccess) {
    dispatch(setByValidate({
      token: result.data,
      code: code,
      IsSucces: true
    }));
    navigate("/recover-password");
  } else {
    setError(result.message);
    setOtp('');
  }
} catch (error: any) {
  const mensagem = ApiErrorHelper.extractErrorMessage(error);
  setError(mensagem);
  setOtp('');
} finally {
  setFadeOut(true);
  setLoading(false);
}

    };

    const HandleResetPassword = async () => {
        try {
            const response = await api.post("RecoverPassword/reset", { email });
            const data = response.data;

            if (data.isSuccess) {
               return toast.current?.show({
                    severity: 'success',
                    summary: 'Código reenviado',
                    detail: 'Verifique seu e-mail.',
                    life: 30000,
                    

                });
                console.log(data.data)
            } else {
                setError(data.message || "Conta não cadastrada");
            }

        } catch (error: any) {
            const mensagens = error.response?.data?.errors;

            if (mensagens) {
                // Transforma as mensagens de erro em texto
                const texto = Object.values(mensagens).flat().join(" | ");
                setError(texto);
                setOtp('')
            } else {
                setError("Erro ao Enviar a Requisição, Certifique-se que o Back-End está ligado");
                setOtp('')
            }
        }
        
    };

    return (
        <div className="card flex justify-content-center">
           <Toast ref={toast} className="toast-fullscreen" />
            <div className="flex flex-column align-items-center justify-content-center card border-2 p-5 border-round-2xl layouts border-bottom-2 form-login shadow-8 glass">
            
                <form method='post' autoCapitalize='on' onSubmit={HandleSubmit}>
                    <p className="font-bold text-xl mb-2 nav text-center">Recuperação de Senha</p>
                    
                    {error && (
                        <div className="my-3  text-center">
                            <Message severity="error" text={error} />
                        </div>
                    )}

                    <p className="mb-5 nav text-center">Digite o código enviado para seu e-mail.</p>

                    <div className='mx-auto text-center flex justify-content-center'>
                        <InputOtp
                            value={code}
                            onChange={(e) => setOtp(e.value?.toString() as string)}
                            length={6}
                            style={{ gap: 6 }}
                        />
                    </div>
                     {loading && (
                      <div className={`overlay ${fadeOut ? 'fade-out' : ''}`}>
                        <div className="spinner-box">
                          <ProgressSpinner />
                          <div className="loading-message">Processando<span className="dots">.</span></div>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-content-between mt-5 align-self-stretch gap-8">
                        <Button
                            label="Reenviar Código"
                            severity='secondary'
                            className="nav w-10"
                            onClick={HandleResetPassword}
                            type="button"
                        />
                        <Button
                            label="Enviar Código"
                            className="p-button-mobile"
                            disabled={code.length !== 6}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
