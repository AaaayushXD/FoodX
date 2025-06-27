import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  favouriteReducer,
  OrderReducer,
  authReducer,
  cartReducer,
  categoryReducer,
} from "@/reducer";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { productReducer } from "./reducer/products";
const rootReducer = combineReducers({
  cart: cartReducer,
  favourite: favouriteReducer,
  product: productReducer,
  category: categoryReducer,
  auth: authReducer,
  order: OrderReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducerPersist = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: {
    root: reducerPersist,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
