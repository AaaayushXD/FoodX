import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  ProductReducer,
  AuthReducer,
  categoryReducer,
} from "../Reducer/Action";
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

// const loginRoot = combineReducers({
//   authRegister: registerSlice,
//   authLogin: loginSlice,
// });

const rootReducer = combineReducers({
  auth: AuthReducer,
  Products: ProductReducer,
  category: categoryReducer,
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

export let persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
