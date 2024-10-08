import React, { useEffect, useState } from "react";
import Dasboard from "./Pages/Dashboard/Dasboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { DesktopSlider, MobileSlider } from "./Components/Slider/Slider";
import Analytics from "./Pages/Analytics/Analytics";
import OrderList from "./Pages/Order/Order.page";
import CustomerList from "./Pages/User/User.page";
import TicketPage from "./Pages/Ticket/Ticket.chef.page";
import { AdminProfile } from "./Pages/Profile/AdminProfile";
import BannerPage from "./Pages/Banner/Banner.page";
import FoodPage from "./Pages/Product/Product.page";
import Login from "./Auth/Login/Login";
import { Register } from "./Auth/Register/Register";
import { PrivateRoute } from "./PrivateRoute";
import { useSelector } from "react-redux";
import { RootState } from "./Store";
import NotFoundPage from "./Pages/404Page/NotFoundPage";
import Footer from "./Components/Footer/Footer";
import { CategoryPage } from "./Pages/Category/Category.page";
import Navbar from "./Components/Navbar/Navbar";
import { WelcomePage } from "./Pages/Page.Welcome";
import { UserRole } from "./models/user.model";
import { socket } from "./Utility/socket.util";
import TicketAdminPage from "./Pages/Ticket/Ticket.admin.page";

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
          <Navbar />
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

  useEffect(() => {
    auth.success ? setShowContent(true) : setShowContent(false);
  }, [auth.success]);

  const [userRole, setUserRole] = useState<UserRole["role"]>(
    auth.userInfo.role as UserRole["role"]
  );

  useEffect(() => {
    socket.connect();
    return () => {
      socket.off("chef");
    };
  });
  return (
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
              <Login role={userRole as UserRole["role"]} />
            )
          }
        />
        <Route
          path="register/"
          element={
            showContent ? (
              <Navigate to={`/${auth.userInfo.role}`} replace />
            ) : (
              <Register />
            )
          }
        />
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
  );
};

export default App;
