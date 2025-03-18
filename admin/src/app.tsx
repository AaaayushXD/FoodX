import React, { useEffect, useState } from "react";
import Dasboard from "./pages/dashboard/dashboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { PrivateRoute } from "./privateRoute";
import { useSelector } from "react-redux";

import { QueryClient, QueryClientProvider } from "react-query";
import { RootState } from "./store";
import "./index.css";

const DesktopSlider = React.lazy(() =>
  import("./components").then((module) => ({
    default: module.DesktopSlider,
  }))
);
const MobileSlider = React.lazy(() =>
  import("./components").then((module) => ({
    default: module.MobileSlider,
  }))
);
const Analytics = React.lazy(() => import("./pages/analytics/main"));
const OrderList = React.lazy(() => import("./pages/order/orderPage"));
const CustomerList = React.lazy(() => import("./pages/user/userPage"));
const TicketPage = React.lazy(
  () => import("./pages/ticket/chef/chef_ticketPage")
);
const AdminProfile = React.lazy(() =>
  import("./auth/settings/view/AdminProfile").then((module) => ({
    default: module.AdminProfile,
  }))
);
const BannerPage = React.lazy(() => import("./pages/banner/bannerPage"));
const FoodPage = React.lazy(() => import("./pages/product/productPage"));
const Login = React.lazy(() =>
  import("@/auth").then((module) => ({ default: module.Login }))
);
const NotFoundPage = React.lazy(() => import("./pages/404Page/NotFoundPage"));
const Footer = React.lazy(() => import("./components/footer/footer"));
const CategoryPage = React.lazy(() =>
  import("./pages/category/categorypage").then((module) => ({
    default: module.CategoryPage,
  }))
);
const Navbar = React.lazy(() =>
  import("./components").then((module) => ({ default: module.Navbar }))
);
const WelcomePage = React.lazy(() =>
  import("./pages").then((module) => ({
    default: module.WelcomePage,
  }))
);
const TicketAdminPage = React.lazy(() =>
  import("@/pages").then((module) => ({ default: module.TicketAdminPage }))
);

const MainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden ">
      <div className=" flex xl:flex-row flex-col w-full 2xl:container lg:h-[100vh] gap-4 py-3 items-start justify-center  px-3 xl:px-5">
        <div className="hidden xl:flex ">
          <DesktopSlider closeFn={() => {}} open={false} />
        </div>
        <div className="flex w-full xl:hidden">
          <MobileSlider />
        </div>
        <div className="w-full h-full overflow-auto  flex flex-col items-center justify-end bg-[var(--light-foreground)] ">
          <Navbar open />
          <div className="w-full h-[200vh] overflow-y-auto overflow-x-hidden 2xl:justify-between  flex flex-col items-center bg-[var(--light-foreground)]  ">
            <Outlet />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const auth = useSelector((state: RootState) => state.root.user);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<Auth.UserRole>(
    auth.userInfo.role as Auth.UserRole
  );

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 5 } },
  });

  useEffect(() => {
    auth.success ? setShowContent(true) : setShowContent(false);
  }, [auth.success]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              !auth.userInfo.role ? (
                <WelcomePage user={(role) => setUserRole(role)} />
              ) : (
                <Navigate to={`/${auth.userInfo.role}`} replace />
              )
            }
          />
          <Route
            path="login/"
            element={
              showContent ? (
                <Navigate to={`/${auth.userInfo.role}`} replace />
              ) : (
                <Login role={userRole as Auth.UserRole} />
              )
            }
          />
          z
          <Route
            element={
              <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
            }
          >
            <Route path={`${userRole}/`} element={<MainPage />}>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route index element={<Dasboard />} />
              </Route>
              <Route element={<PrivateRoute role={[{ role: "admin" }]} />}>
                <Route path="analytics" element={<Analytics />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="order-list" element={<OrderList />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="customer-list" element={<CustomerList />} />
              </Route>

              <Route element={<PrivateRoute role={[{ role: "chef" }]} />}>
                <Route path="contact/chef-tickets" element={<TicketPage />} />
              </Route>
              <Route element={<PrivateRoute role={[{ role: "admin" }]} />}>
                <Route
                  path="contact/admin-tickets"
                  element={<TicketAdminPage />}
                />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="contact/profile" element={<AdminProfile />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="collection/foodlist" element={<FoodPage />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="collection/banner" element={<BannerPage />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="category" element={<CategoryPage />} />
              </Route>
              <Route
                element={
                  <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
                }
              >
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
