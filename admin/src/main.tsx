import ReactDOM from "react-dom/client";
import App from "./app";
import "./App.css";
import { Provider } from "react-redux";
import { persistor, Store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { Loading } from "@/common";
import { ThemeContextProvider } from "@/context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Suspense fallback={<Loading isLoading={true} loadingFn={() => false} />}>
    <Provider store={Store}>
      <PersistGate persistor={persistor} loading={"loading"}>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </PersistGate>
      <Toaster  />
    </Provider>
  </Suspense>
);
