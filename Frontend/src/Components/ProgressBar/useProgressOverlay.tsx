import { useState, useCallback } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import "../ProgressBar/ProgressOverlay.css";

export function useProgressOverlay() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const show = useCallback(() => {
    setFadeOut(false);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => setVisible(false), 500); // tempo do fade-out
  }, []);

  const ProgressOverlay = () => (
    visible && (
      <div className={`overlay ${fadeOut ? "fade-out" : ""}`}>
        <div className="spinner-box">
          <ProgressSpinner />
          <div className="loading-message">Processando<span className="dots">.</span></div>
        </div>
      </div>
    )
  );

  return { ProgressOverlay, show, hide };
}
