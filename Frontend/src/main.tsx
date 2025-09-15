import React from "react";
import ReactDOM from "react-dom/client";
// 🔹 Certifique-se de importar isso
import { Provider } from "react-redux";

import { App } from "./App";
import { persistor, store } from "./Store/StoreReducer";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

