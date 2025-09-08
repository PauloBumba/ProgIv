import React from "react";
import ReactDOM from "react-dom/client";
// 🔹 Certifique-se de importar isso
import { Provider } from "react-redux";

import { App } from "./App";
import { store } from "./Store/StoreReducer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
     
        <App />
     
    </Provider>
  </React.StrictMode>
);
