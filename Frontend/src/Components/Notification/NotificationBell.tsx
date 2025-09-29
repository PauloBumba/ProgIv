import React, { useRef, useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import * as signalR from "@microsoft/signalr";

interface NotificationDto {
  title?: string;
  message?: string;
  type: "error" | "info" | "secondary" | "success" | "contrast" | "warn" | undefined;

  timestamp?: string;
  actionUrl?: string;
  icon?: string;
}

interface NotificationBellProps {
  userId: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  void userId;
  const op = useRef<OverlayPanel | null>(null);
  const toast = useRef<Toast | null>(null);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  // Monta a conexão SignalR
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7296/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
        logger: signalR.LogLevel.Trace, // debug detalhado
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  // Inicia conexão e escuta notificações
  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("✅ Conectado ao SignalR");

        connection.on("ReceiveNotification", (notification: NotificationDto | string) => {
          console.log("Notificação recebida:", notification);

          const notifObj: NotificationDto =
            typeof notification === "string" ? { message: notification, type: "info" } : notification;

          toast.current?.show({
            severity: notifObj.type || "info",
            summary: notifObj.title || "Notificação",
            detail: notifObj.message || "",
            life: 5000,
          });

          setNotifications((prev) => [notifObj, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
      } catch (e) {
        console.error("Erro na conexão SignalR:", e);
        toast.current?.show({
          severity: "error",
          summary: "Erro de Conexão",
          detail: "Não foi possível conectar ao serviço de notificações.",
          life: 5000,
        });
      }
    };

    startConnection();

    return () => {
      connection.stop().catch((e) => console.error("Erro ao desconectar SignalR:", e));
    };
  }, [connection]);

  // Função para abrir o OverlayPanel e resetar contador
  const handleOpen = (e: React.MouseEvent) => {
    if (op.current && typeof op.current.toggle === "function") {
      op.current.toggle(e);
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      <Toast ref={toast} />
      <Button icon="pi pi-bell" className="p-button-rounded p-button-text" onClick={handleOpen} />
      {unreadCount > 0 && (
        <Badge value={unreadCount} severity="danger" className="absolute -top-1 -right-1" />
      )}

      <OverlayPanel ref={op} dismissable>
        <div style={{ width: 300, maxHeight: 400, overflowY: "auto" }}>
          <h4>Notificações</h4>
          {notifications.length === 0 ? (
            <p>Sem notificações 📭</p>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} className="mb-2 border-bottom pb-2">
                <strong>{n.title || "Notificação"}</strong>
                <p className="text-sm">{n.message}</p>
                <small className="text-muted">
                  {n.timestamp
                    ? new Date(n.timestamp + "Z").toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
                    : new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                </small>
              </div>
            ))
          )}
        </div>
      </OverlayPanel>
    </div>
  );
};

export default NotificationBell;
