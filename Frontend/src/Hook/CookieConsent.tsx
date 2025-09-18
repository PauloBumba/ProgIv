import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default function CookieConsent({ onAccept }: { onAccept: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // se o usuário já aceitou antes, não mostra mais
    const aceito = localStorage.getItem("cookieAceito");
    if (!aceito) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAceito", "true");
    setVisible(false);
    onAccept(); // aqui você já pode acionar o "lembrar de mim"
  };

  return (
    <Dialog
    onHide={() => setVisible(false)}
      header="Termo de Responsabilidade"
      visible={visible}
      modal
      closable={false}
      style={{ width: "400px" }}
    >
      <p>
        Ao continuar, você aceita que este site use cookies para armazenar suas
        informações de login e preferências de navegação.
      </p>
      <Button
        label="Aceito"
        onClick={handleAccept}
        className="p-button-success"
      />
    </Dialog>
  );
}
