import { useSelector } from "react-redux";
import { RootState } from "./store";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "./@types/user.model";

interface PrivateRouteProp {
  role: UserRole[];
}


export const PrivateRoute: React.FC<PrivateRouteProp> = ({ role }) => {
const roles = role?.map((eachRole)=> eachRole.role)
  const auth = useSelector((state: RootState) => state.root.user);

  useEffect(() => {}, [auth.success, auth?.userInfo]);

  return auth.success ? (
    roles.includes( auth.userInfo.role as  "admin"| "chef") ? (
      <Outlet />
    ) : (
      <div>Unauthorized Access</div>
    )
  ) : (
    <Navigate to={"/login"} replace />
  );
};
