import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Message } from "primereact/message";

const AccessDenied: React.FC = () => {
 const navigate = useNavigate();
  const [countdown, setCountdown] = useState(100); // segundos para redirecionar

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/login");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="border-2 p-5 border-round-2xl layouts border-bottom-2 form-login shadow-8 glass ">
      <Message severity="warn" text="Acesso Negado" className="mb-3 text-xl text-center flex justify-content-center" />
      <p className="text-lg text-2xl mt-2 max-w-md flex justify-content-center">
        Você não tem permissão para acessar esta página ou sua sessão expirou.
      </p>
      <Button
        label="Voltar ao Login"
        icon="pi pi-sign-in"
        className="mt-4 p-button-danger text-center flex justify-content-center mx-auto"
        onClick={() => navigate("/login")}
      />
      <p className="text-lg text-gray-500 mt-2 flex justify-content-center">
        Você será redirecionado automaticamente em <strong className="bg-red-100 text-red-50">{countdown}</strong> segundo{countdown !== 1 && "s"}.
      </p>
    </div>
  );
};

export default AccessDenied;
