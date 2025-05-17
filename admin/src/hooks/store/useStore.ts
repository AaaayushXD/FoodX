import { AppDispatch } from "@/store";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

export const useAppDipsatch = () => useDispatch<AppDispatch>();
export const useAppSelector = () =>
  useSelector((state: RootState) => state.root);
