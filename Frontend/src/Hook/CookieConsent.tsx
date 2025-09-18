import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export default function CookieConsent({ onAccept }: { onAccept: () => void }) {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
    onAccept();
  };

  return (
    <Dialog
      header="Termo de Responsabilidade"
      visible={visible}
      modal
      closable={false}
      style={{ width: "400px" }}
      onHide={() => setVisible(false)}
    >
      <p>
        Ao continuar, você aceita que este site use cookies para armazenar suas
        informações de login e preferências de navegação.
      </p>
      <Button label="Aceito" onClick={handleAccept} className="p-button-success" />
    </Dialog>
  );
}
