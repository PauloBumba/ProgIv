import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { AppRouter } from "./Router/approuter";

// 🔹 Importando os interceptores

export const App: React.FC = () => {
  
  return (
    <div>
    
      <AppRouter />
    </div>
  );
};
