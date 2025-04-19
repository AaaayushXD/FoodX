import React, { lazy } from "react";
import { FavouritePage, ProfilePage, SingleOrder } from "../pages";
import ErrorBoundary from "@/errorBoundary";
const CategoryPage = lazy(() =>
  import("../pages/category/categoryPage").then((module) => ({
    default: module.CategoryPage,
  }))
);
const MobileNotification = lazy(() =>
  import("../pages").then((module) => ({
    default: module.MobileNotification,
  }))
);

const ProductPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.ProductPage }))
);
const SearchPage = lazy(() =>
  import("../pages").then((module) => ({ default: module.SearchPage }))
);

const Login = React.lazy(() =>
  import("../components").then((module) => ({ default: module.Login }))
);
const OrderSuccess = React.lazy(() =>
  import("../pages/Order.Success.page").then((module) => ({
    default: module.OrderSuccess,
  }))
);
const VerificationPage = React.lazy(() =>
  import("../pages").then((module) => ({
    default: module.VerificationPage,
  }))
);

const Register = React.lazy(() =>
  import("../components").then((module) => ({
    default: module.Register,
  }))
);
const NotFoundPage = React.lazy(() =>
  import("../pages").then((module) => ({
    default: module.NotFoundPage,
  }))
);
const Home = React.lazy(() =>
  import("../pages").then((module) => ({ default: module.Home }))
);
const ForgotPassword = React.lazy(() =>
  import("@/features").then((module) => ({
    default: module.ForgotPassword,
  }))
);
const CheckoutPage = React.lazy(() =>
  import("@/pages").then((module) => ({
    default: module.CheckoutPage,
  }))
);

const DesktopOrderPage = React.lazy(() =>
  import("../pages").then((module) => ({ default: module.Order }))
);
const MobileOrderPage = React.lazy(() =>
  import("../pages").then((module) => ({ default: module.OrderPage }))
);

interface Routes {
  [path: string]: {
    requiresAuth?: boolean;
    roles?: Array<"customer" | "chef" | "admin">;
    isAccessibleToPublicOnly?: boolean;
    element: React.ReactNode;
    accessToAnyOne: boolean;
  };
}

export const routes: Routes = {
  "/": {
    roles: ["customer"],
    element: <Home />,
    accessToAnyOne: true,
  },
  notifications: {
    roles: ["customer"],
    element: <MobileNotification />,
    accessToAnyOne: false,
    requiresAuth: true,
  },
  "search/:productId": {
    accessToAnyOne: true,
    element: <ProductPage />,
  },
  "favourite/:productId": {
    accessToAnyOne: false,
    element: <ProductPage />,
    requiresAuth: true,
    roles: ["customer"],
  },
  ":collection/:productId": {
    accessToAnyOne: true,
    element: (
      <ErrorBoundary>
        <ProductPage />,
      </ErrorBoundary>
    ),
  },
  "/favourite": {
    accessToAnyOne: false,
    element: <FavouritePage />,
    requiresAuth: true,
    roles: ["customer"],
  },
  "/search": {
    accessToAnyOne: true,
    element: <SearchPage />,
  },
  "/profile": {
    requiresAuth: true,
    roles: ["customer"],
    element: <ProfilePage />,
    accessToAnyOne: false,
  },
  "/profile/:setting": {
    requiresAuth: true,
    accessToAnyOne: false,
    element: <ProfilePage />,
    roles: ["customer"],
  },
  "/category/:id": {
    roles: ["customer"],
    element: <CategoryPage />,
    accessToAnyOne: true,
  },
  "/category/:id/:productId": {
    accessToAnyOne: true,
    element: <ProductPage />,
  },
  "/orders": {
    requiresAuth: true,
    roles: ["customer", "chef", "admin"],
    element: (
      <ErrorBoundary>
        <div className="w-full h-full">
          <div className=" w-full sm:flex hidden ">
            <DesktopOrderPage />
          </div>
          <div className="w-full flex h-full sm:hidden ">
            <MobileOrderPage />
          </div>
        </div>
      </ErrorBoundary>
    ),
    accessToAnyOne: false,
  },
  "/checkout": {
    requiresAuth: true,
    roles: ["customer", "chef", "admin"],
    element: <CheckoutPage />,
    accessToAnyOne: false,
  },
  "orders/:orderId": {
    requiresAuth: true,
    roles: ["customer", "chef", "admin"],
    element: <SingleOrder />,
    accessToAnyOne: false,
    isAccessibleToPublicOnly: false,
  },
  "/order/success": {
    requiresAuth: true,
    roles: ["customer", "chef", "admin"],
    element: <OrderSuccess />,
    accessToAnyOne: false,
  },
  "/login": {
    isAccessibleToPublicOnly: true,
    element: <Login />,
    accessToAnyOne: false,
  },
  "/register": {
    isAccessibleToPublicOnly: true,
    element: <Register />,
    accessToAnyOne: false,
  },
  "/email-verification": {
    isAccessibleToPublicOnly: true,
    element: <VerificationPage />,
    accessToAnyOne: false,
  },
  "/forgot-password": {
    element: <ForgotPassword />,
    accessToAnyOne: true,
  },
  "*": {
    element: <NotFoundPage />,
    accessToAnyOne: true,
  },
};
