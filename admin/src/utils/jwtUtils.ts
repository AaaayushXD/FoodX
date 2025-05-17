import Cookies from "js-cookie";
import { JwtPayload, jwtDecode } from "jwt-decode";

export const getRoleFromAccessToken = async () => {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) throw new Error("Token not Available");

    const decodeToken = jwtDecode<JwtPayload>(accessToken) as any;
    if (!decodeToken) throw new Error("Unverified token");
    const getRole = decodeToken?.role;
    return getRole;
  } catch (error) {
    throw new Error("Error while verifying role");
  }
};
