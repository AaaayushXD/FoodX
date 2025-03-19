import React, { useCallback, useEffect, useRef, useState } from "react";
import CollegeLogo from "@/assets/logo/texas.png";
import {
  Cart,
  NotificationPage,
  LoginContainer,
  Favourite,
  CartPopup,
} from "@/components";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Icons } from "@/utils";
import toast from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Modal } from "@/commons";
import { addProductToCart } from "@/services";
import { addToCart } from "@/reducer";

const navbarItems = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Orders",
    url: "/orders",
  },
];

export const NavbarContainer = () => {
  const location = useLocation();

  return (
    <div className="flex items-center gap-1 justify-start">
      {navbarItems &&
        navbarItems?.map((item, index) => (
          <Link
            to={item.url}
            key={index}
            className={
              "h-full px-5 py-4 text-white contrast-125    text-[18px]  text-start w-full  font-semibold "
            }
          >
            <p className="flex items-center justify-start w-full h-full tracking-wider md:justify-center text-md">
              {item.name}
            </p>
          </Link>
        ))}
    </div>
  );
};

// export const Navbar: React.FC = () => {
//   const [open, setOpen] = useState<boolean>(false);
//   const menuReference = useRef<HTMLDivElement | null>();
//   const [openSearch, setOpenSearch] = useState<boolean>(false);
//   const [searchValue, setSearchValue] = useState<string>("");
//   const [searchData, setSearchData] = useState<Ui.Product[]>();
//   const [closeProfile, setCloseProfile] = useState<boolean>(true);
//   const [openFavourite, setOpenFavourite] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [openNotification, setOpenNotification] = useState<boolean>(false);
//   const [openCart, setOpenCart] = useState<boolean>(false);

//   const { products: allProducts, isLoading } = useAllProducts();

//   const { auth, cart, favourite } = useAppSelector();

//   const FilterRef = useRef<HTMLDivElement | null>(null);
//   const profileRef = useRef<HTMLDivElement | null>(null);
//   const favouriteReference = useRef<HTMLDivElement | null>(null);
//   const notificationReference = useRef<HTMLDivElement | null>(null);
//   const cartReference = useRef<HTMLDivElement | null>(null);
//   const searchReference = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         favouriteReference.current &&
//         !favouriteReference.current.contains(event.target as any)
//       ) {
//         setOpenFavourite(true);
//       }
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(event.target as any)
//       ) {
//         setCloseProfile(true);
//       }
//       if (
//         menuReference.current &&
//         !menuReference.current.contains(event.target as any)
//       ) {
//         setOpen(false);
//       }
//       if (
//         cartReference.current &&
//         !cartReference.current.contains(event.target as any)
//       ) {
//         setOpenCart(false);
//       }
//       if (
//         notificationReference.current &&
//         !notificationReference.current.contains(event.target as any)
//       ) {
//         setOpenNotification(false);
//       }
//       // if (
//       //   topOrderReference.current &&
//       //   !topOrderReference.current.contains(event.target as any)
//       // ) {
//       //   setOpenOrder(false);
//       // }
//       if (
//         searchReference.current &&
//         !searchReference.current.contains(event.target as any)
//       ) {
//         setOpenSearch(false);
//       }
//     };

//     if (
//       !closeProfile ||
//       !openFavourite ||
//       openNotification ||
//       open ||
//       openCart ||
//       openSearch
//     ) {
//       document.body.style.overflowY = "hidden";
//     } else {
//       document.body.style.overflowY = "auto";
//     }

//     if (
//       !closeProfile ||
//       !openFavourite ||
//       !open ||
//       openNotification ||
//       !openCart ||
//       !openSearch
//     ) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.body.style.overflowY = "auto";
//     };
//   }, [
//     closeProfile,
//     openFavourite,
//     open,
//     openNotification,
//     openCart,
//     openSearch,
//   ]);
//   const navigate = useNavigate();

//   const handleSearch = async (value: string) => {
//     if (value.length <= 0) return;
//     if (!isFetched) return setLoading(isFetched);

//     try {
//       setLoading(isFetched);
//       const filter = await searchProducts(value);
//       setSearchData(filter);
//     } catch (error) {
//       throw new Error("Error while search product" + error);
//     }
//     setLoading(false);
//   };

//   const searchProducts = async (value: string) => {
//     if (isFetched) {
//       const filterProducts = allProducts?.filter((product) =>
//         product.name.toLowerCase().includes(value.toLowerCase())
//       );
//       return filterProducts;
//     }
//   };

//   const debounceSearch = useCallback(debounce(handleSearch, 200), [
//     searchValue,
//     allProducts,
//   ]);

//   return (
//     <div className="  flex flex-col items-start">
//       <nav
//         ref={FilterRef}
//         className="w-full   bg-[var(--body-bg)]  min-w-[100vw] z-[100] h-[70px] sm:h-[100px] flex justify-between items-center px-5 gap-5 text-[var(--dark-secondary-text)] relative"
//       >
//         <div className="flex items-center justify-start gap-4">
//           <div ref={menuReference as any} className="flex w-full md:hidden ">
//             <button
//               aria-label="menu-button"
//               className=""
//               onClick={() => setOpen(!open)}
//             >
//               {open ? (
//                 <Icons.close className="cursor-pointer md:size-10 size-[30px] sm:size-8" />
//               ) : (
//                 <Icons.menu className="cursor-pointer md:size-10 size-[30px] sm:size-8 " />
//               )}
//             </button>
//             <div
//               className={`w-full  backdrop-blur-lg z-[100]  duration-150 ${
//                 open
//                   ? "top-0  left-0 opacity-100 "
//                   : " opacity-0 bg-transparent left-[-1000px] "
//               }  flex justify-start items-center absolute   `}
//             >
//               {/* <MobileSlider open={open} action={() => setOpen(!open)} /> */}
//             </div>
//           </div>
//           {/* Logo */}
//           <div
//             className="items-center hidden cursor-pointer sm:flex shrink-0 "
//             onClick={() => navigate("/")}
//           >
//             <img
//               src={CollegeLogo}
//               alt="college logo"
//               className="max-h-[80px]  w-[160px]  md:w-full h-full p-2  "
//             />
//           </div>
//         </div>
//         {/* Navbar  */}
//         <div className="hidden h-full md:flex">
//           <NavbarContainer />
//         </div>
//         {/*  Product Search */}
//         <div className="h-full flex items-center text-[var(--dark-text)]">
//           <div className="flex items-center justify-center h-full gap-3 place-items-center">
//             <div ref={searchReference}>
//               <button
//                 aria-label="search"
//                 aria-labelledby="search-button"
//                 className={`py-2.5 sm:flex hidden rounded-r-lg duration-150`}
//                 onClick={() => setOpenSearch(!openSearch)}
//               >
//                 {openSearch ? (
//                   <Icons.close className=" size-[30px] sm:size-7 " />
//                 ) : (
//                   <Icons.search
//                     id="search-button"
//                     className="size-[30px] sm:size-7"
//                   />
//                 )}
//               </button>

//               <div
//                 className={`absolute md:right-3 bg-[var(--light-foreground)] mx-3 px-3 md:px-0 hidden sm:flex border-[var(--dark-border)] border-[1px] rounded-lg  items-center justify-start ${
//                   openSearch
//                     ? "visible md:w-[500px] translate-y-0 opacity-100 "
//                     : "w-0 invisible opacity-0  -translate-y-10 "
//                 } duration-150 top-[103px] right-0 md:left-auto left-0 `}
//               >
//                 <input
//                   value={searchValue}
//                   onChange={(event) => {
//                     debounceSearch(event.target.value);
//                     setSearchValue(event.target.value);
//                   }}
//                   type="text"
//                   className={` w-full sm:flex  duration-150  outline-none   bg-[var(--light-foreground)]   rounded-l-lg  py-2.5 px-5`}
//                 />
//                 <button
//                   className="  py-2.5 px-2 rounded-r-lg bg-[var(--light-foreground)] "
//                   onClick={() => setOpenSearch(false)}
//                 >
//                   <Icons.close className="hover:text-[var(--danger-bg)] size-5 md:size-6 " />
//                 </button>
//               </div>
//               {/* mobile search */}
//               <div
//                 className={` duration-150 ${
//                   searchValue?.length > 0 && openSearch
//                     ? "visible opacity-100 translate-y-0 "
//                     : "invisible opacity-0 -translate-y-10 "
//                 } w-full h-full top-[8rem] sm:top-[10rem]   flex justify-end right-0 px-3 absolute`}
//               >
//                 <div className="border-[1px] w-full rounded-lg md:w-auto  px-4 py-3 gap-3 flex flex-col bg-[var(--light-foreground)] border-[var(--dark-border)] overflow-auto h-[60vh]  ">
//                   <span
//                     className={`text-xs    w-full text-[var(--dark-secondary-text)]`}
//                   >
//                     {searchData && searchData?.length > 0
//                       ? `${searchData?.length} products available`
//                       : `No products available`}
//                   </span>
//                   <div className="w-full md:w-[500px] pr-4 rounded-lg  shadow   scrollbar-custom  overflow-y-auto h-[60vh]  ">
//                     {loading ? (
//                       <div className="flex items-center justify-center w-full  h-full">
//                         <p className="text-[20px]  flex items-center justify-center gap-3 text-[var(--light-secondary-text)] font-semibold ">
//                           <RotatingLines
//                             strokeColor="var(--dark-secondary-text)"
//                             width="27"
//                           />{" "}
//                           <span> Loading...Please wait!</span>
//                         </p>
//                       </div>
//                     ) : (
//                       searchData?.map(() => "")
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/*cart */}
//             <div ref={cartReference} className="relative md:hidden visible ">
//               <Icons.shoppingBag
//                 onClick={() => setOpenCart(!openCart)}
//                 className="cursor-pointer sm:size-7 size-[27px] "
//               />
//               <div
//                 className={`sm:w-[10px] size-1.5 duration-150 ${
//                   cart?.products.length > 0 && auth.userInfo.role
//                     ? "visible"
//                     : "hidden"
//                 } top-[6px] sm:top-[2px] right-[4px] sm:right-[2px] absolute sm:h-[10px] rounded-full bg-[#a50c0c]`}
//               ></div>
//               <div
//                 className={`absolute ${
//                   openCart
//                     ? "visible below-xs-cart opacity-100 translate-y-0"
//                     : "invisible translate-y-10 opacity-0"
//                 } duration-150 top-10  bg-[var(--light-foreground)] rounded-lg p-2 ${
//                   auth?.success
//                     ? "right-[-147px] sm:right-[-139px] "
//                     : "sm:right-[-85px]  right-[-94px] "
//                 } w-[342px] sm:w-[450px]  sm:h-[585px] `}
//               >
//                 <Cart action={() => setOpenCart(!openCart)} />
//               </div>
//             </div>
//             {/* top products */}
//             {/* <div ref={topOrderReference} className="relative">
//             <button
//               onClick={() => setOpenOrder(!openOrder)}
//               className="scale-[1.4]"
//             >
//               🔥
//             </button>
//             <div
//               className={`absolute ${
//                 openOrder
//                   ? "visible opacity-100 translate-y-0"
//                   : "invisible translate-y-10 opacity-0"
//               } duration-150 top-10 rounded-lg p-2 right-[-165px] sm:right-[-40px] w-[342px] sm:w-[450px] h-[550px]`}
//             >
//               <TopProduct />
//             </div>
//           </div> */}

//             <div className="relative " ref={favouriteReference as any}>
//               <div className="relative">
//                 <Icons.heart
//                   onClick={() => setOpenFavourite(!openFavourite)}
//                   className="cursor-pointer size-[27px] sm:size-7 "
//                 />
//                 <div
//                   className={`sm:w-[10px] size-1.5 duration-150 ${
//                     favourite?.favourite.length > 0 && auth.userInfo.role
//                       ? "visible"
//                       : "hidden"
//                   } sm:top-[2px] top-[4px] right-0 absolute sm:h-[10px] rounded-full bg-[#a50c0c]`}
//                 ></div>
//               </div>
//               {/* Favourite container */}
//               <div
//                 className={` sm:left-[-23rem] right-[-104px] sm:w-[450px] below-xs-favourite w-[340px] top-12 duration-150  absolute ${
//                   !openFavourite && auth.userInfo.fullName
//                     ? "visible z-10 translate-y-0 opacity-100 "
//                     : "-translate-y-2 invisible opacity-0 z-[-100]"
//                 } `}
//               >
//                 <Favourite />
//               </div>
//               {!openFavourite && !auth.userInfo.fullName && (
//                 <Modal
//                   close={openFavourite}
//                   closeModal={() => setOpenFavourite(!openFavourite)}
//                 >
//                   <LoginContainer />
//                 </Modal>
//               )}
//             </div>

//             {/* profile */}
//             {auth.userInfo.fullName && (
//               <div ref={notificationReference as any} className="relative">
//                 <Icons.bell
//                   onClick={() => setOpenNotification(!openNotification)}
//                   className="cursor-pointer size-[27px] sm:size-7 "
//                 />

//                 <div
//                   className={`absolute below-xs w-[350px] z-30 duration-150 ${
//                     openNotification
//                       ? "visible opacity-100 -translate-y-0 "
//                       : "invisible opacity-0 translate-y-10"
//                   }   sm:right-[0rem] right-[-68px]  top-9`}
//                 >
//                   <NotificationPage isOpen={openNotification} />
//                 </div>
//               </div>
//             )}
//             <div ref={profileRef} className="">
//               {auth.userInfo?.avatar && (
//                 <div className="relative w-full">
//                   <div
//                     onClick={() => setCloseProfile(!closeProfile)}
//                     className=" hover:bg-[#8080807c]  p-1 rounded-full cursor-pointer group/user"
//                   >
//                     <img
//                       className="size-8 rounded-full  sm:w-11 sm:h-10"
//                       src={auth.userInfo.avatar}
//                       alt=""
//                     />
//                   </div>
//                   <div
//                     className={` duration-150 ${
//                       !closeProfile && auth.userInfo.fullName
//                         ? "visible opacity-100 "
//                         : "invisible opacity-0 "
//                     } w-full absolute right-[256px] sm:right-[19.3rem] top-[46px] sm:top-[53px]  `}
//                   >
//                     <Profile
//                       closeModal={() => setCloseProfile(!closeProfile)}
//                       user={auth.userInfo}
//                     />
//                   </div>
//                 </div>
//               )}
//               {!auth.userInfo?.fullName && (
//                 <div
//                   onClick={() => setCloseProfile(!closeProfile)}
//                   className=""
//                 >
//                   <Icons.user className=" sm:size-7 size-[30px] transition-colors duration-500 ease-in-out md:flex hover:text-[var(--secondary-color)] cursor-pointer shrink-0" />
//                 </div>
//               )}
//               {!closeProfile && !auth.userInfo?.fullName && (
//                 <Modal
//                   close={closeProfile}
//                   closeModal={() => setCloseProfile(!closeProfile)}
//                 >
//                   <LoginContainer />
//                 </Modal>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//       <div
//         className={` sm:hidden w-[280px]  bg-[var(--light-background)] text-[var(--dark-text)]  ml-[22px] px-1  flex border-[var(--dark-border)] border-[1px] rounded-lg  items-center justify-start  duration-150 `}
//       >
//         <button
//           aria-label="search"
//           className="  py-1.5 px-1 text-[var(--dark-secondary-text)] rounded-r-lg bg-[var(--light-background)] "
//           onClick={() => setOpenSearch(false)}
//         >
//           <Icons.search className="hover:text-[var(--danger-bg)] size-[17px] sm:size-6 " />
//         </button>
//         <input
//           onFocus={() => setOpenSearch(true)}
//           value={searchValue}
//           onChange={(event) => {
//             debounceSearch(event.target.value);
//             setSearchValue(event.target.value);
//           }}
//           placeholder="Search...."
//           type="text"
//           className={` w-full placeholder:text-[14px]  duration-150  outline-none   bg-[var(--light-background)]   rounded-l-lg  py-1 px-1`}
//         />
//       </div>
//     </div>
//   );
// };

// export const MobileSlider: React.FC<MobileSliderProp> = ({ action, open }) => {
//   const { auth } = useAppSelector();

//   const navigate = useNavigate();

//   const reference = useRef<HTMLDivElement | null>(null);

//   const { loading, logout } = useLogout();

//   useEffect(() => {
//     const handleScroll = (event: MouseEvent) => {
//       if (
//         reference.current &&
//         !reference.current.contains(event.target as Node)
//       ) {
//         action();
//       }
//     };
//     if (open) {
//       window.addEventListener("mousedown", handleScroll);
//     }

//     return () => {
//       window.removeEventListener("mousedown", handleScroll);
//     };
//   });

//   return (
//     <div
//       ref={reference}
//       className="w-[250px] relative  gap-5 px-3 py-10 h-screen  bg-[var(--light-foreground)] flex flex-col items-center  rounded"
//     >
//       <div className="flex justify-between py-3  items-start w-full">
//         <div
//           onClick={() => {
//             navigate("/");
//             action();
//           }}
//           className=" w-[150px] cursor-pointer h-[50px] "
//         >
//           <img className="w-full h-full" src={CollegeLogo} alt="" />
//         </div>
//         <button
//           aria-labelledby="close-button"
//           aria-label="close"
//           onClick={() => action()}
//           className=""
//         >
//           <Icons.close
//             stroke="0.2"
//             id="close-button"
//             className="duration-150 size-[30px] sm:size-7 hover:text-red-600"
//           />
//         </button>
//       </div>
//       <div className="flex items-center justify-start w-full gap-5 pl-3">
//         <div className="w-[50px] h-[50px] ">
//           <img
//             className="w-full h-full rounded-lg"
//             src={auth.userInfo?.avatar || Avatar}
//             alt=""
//           />
//         </div>
//         {
//           <div className="flex flex-col items-start justify-center ">
//             <p className="text-[15px] tracking-wider ">
//               {(auth.userInfo.fullName &&
//                 auth.userInfo?.fullName.charAt(0).toUpperCase() +
//                   auth.userInfo?.fullName?.slice(1)) ||
//                 "Guest"}
//             </p>
//             <span className="text-xs text-gray-300 ">
//               {auth.userInfo?.email || "guest@gmail.com"}
//             </span>
//           </div>
//         }
//       </div>
//       <div className="flex  pt-5  items-start scrollbar-custom justify-start flex-grow w-full h-full overflow-auto">
//         <ul className="flex flex-col text-[var(--dark-text)] items-start justify-center w-full gap-4 sm:gap-10">
//           <li
//             onClick={() => {
//               navigate("/");
//               action();
//             }}
//             className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28] text-[15px]   w-full p-3 rounded duration-150"
//           >
//             <Icons.home className="size-5" />
//             <span>Home</span>
//           </li>
//           <li
//             onClick={() => {
//               navigate("cart");
//               action();
//             }}
//             className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]  text-[15px]  w-full p-3 rounded duration-150"
//           >
//             <Icons.shoppingBag className="size-5" />
//             <span>Cart</span>
//           </li>
//           <li
//             onClick={() => {
//               navigate("orders");
//               action();
//             }}
//             className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]  text-[15px]  w-full p-3 rounded duration-150"
//           >
//             <Icons.history className="size-5" />
//             <span>Order</span>
//           </li>
//           <li
//             onClick={() => {
//               navigate("profile");
//               action();
//             }}
//             className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28] text-[15px]   w-full p-3 rounded duration-150"
//           >
//             <Icons.setting className="size-5" />
//             <span>Setting</span>
//           </li>
//           <DarkMode />
//         </ul>
//       </div>
//       <button
//         aria-labelledby="logout-button"
//         aria-label="logout"
//         disabled={loading}
//         onClick={() => {
//           logout();
//           action();
//         }}
//         className="flex top-[85vh] bg-[var(--light-foreground)] z-[100] left-2 right-2 absolute items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]     p-3 rounded duration-150"
//       >
//         <Icons.logout className="size-5" />
//         <p id="logout-button"> Logout</p>
//       </button>
//     </div>
//   );
// };

export const MobileNavbar = () => {
  const [isScroll, setIsScroll] = useState<"up" | "down" | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { cart } = useAppSelector();

  useEffect(() => {
    const scrollDetector = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsScroll("down"); // Scrolling Down
      } else {
        setIsScroll("up"); // Scrolling Up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", scrollDetector);
    return () => window.removeEventListener("scroll", scrollDetector);
  }, [lastScrollY]);

  const navbar: { title: string; path: string; icon: any }[] = [
    {
      title: "Home",
      path: "/",
      icon: <Icons.home className="size-5" />,
    },
    {
      title: "Favourite",
      path: "/favourite",
      icon: <Icons.heart className="size-5" />,
    },
    {
      title: "Reorder",
      path: "/orders",
      icon: <Icons.reOrder className="size-5" />,
    },
    {
      title: "Notificaion",
      path: "/notifications",
      icon: <Icons.bell className="size-5" />,
    },
  ];

  const navigate = useNavigate();

  return (
    <div
      className={`w-full ${
        isScroll === "up" || null ? "bottom-0 lg:bottom-10 " : "lg:bottom-5"
      } duration-150 flex z-[1000] justify-between  items-center fixed bottom-0 lg:bg-transparent bg-white left-0 right-0  lg:shadow-none shadow`}
    >
      <div className="w-full flex-col  duration-150    flex items-center justify-between">
        <CartPopup />

        <div
          className={`w-full  ${
            cart?.products?.length > 0 ? "border-t lg:border-none " : ""
          }  duration-150 ${
            isScroll === "up"
              ? " h-[50px]  p-[18px] opacity-100"
              : " h-0 opacity-0"
          } flex lg:hidden items-center   justify-between`}
        >
          {navbar?.map((data, key) => (
            <div
              key={key}
              onClick={() => navigate(`${data.path}`)}
              className="flex flex-col items-center justify-start gap-1"
            >
              <button className="text-[var(--secondary-text)] ">
                {data.icon}
              </button>
              <p className="text-[12px] font-[600] text-[var(--secondary-text)] ">
                {data.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// //header
// const Header: React.FC = () => {
//   const [nav, setNav] = useState<boolean>(false);
//   const changeColor = () => {
//     if (window.scrollY >= 10) {
//       setNav(true);
//     } else {
//       setNav(false);
//     }
//   };

//   const { display, setDisplay } = useThemeContext();

//   useEffect(() => {
//     window.addEventListener("scroll", changeColor);

//     return () => {
//       window.removeEventListener("scroll", changeColor);
//     };
//   }, []);

//   return (
//     <header className="w-full min-w-[100vw] h-full relative ">
//       <div
//         className={
//           "bg-[var(--primary-color)] contrast-150 sm:flex items-center justify-between hidden "
//         }
//       >
//         <div className="flex items-center gap-2 px-5 py-2">
//           <Icons.phone className="text-[var(--secondary-color)] sm:size-6 size-5 " />
//           <p className="text-xs text-gray-300 ">
//             01-4589134, 01-4588627,9801644462
//           </p>
//         </div>
//         <button className="cursor-pointer pr-4">
//           <label className="theme-switch">
//             <input
//               onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                 if (e.target.checked) {
//                   setDisplay("dark");
//                 } else {
//                   setDisplay("light");
//                 }
//               }}
//               checked={display === "dark" ? true : false}
//               type="checkbox"
//               className="theme-switch__checkbox"
//             />
//             <div className="theme-switch__container">
//               <div className="theme-switch__clouds"></div>
//               <div className="theme-switch__stars-container">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 144 55"
//                   fill="none"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
//                     fill="currentColor"
//                   ></path>
//                 </svg>
//               </div>
//               <div className="theme-switch__circle-container">
//                 <div className="theme-switch__sun-moon-container">
//                   <div className="theme-switch__moon">
//                     <div className="theme-switch__spot"></div>
//                     <div className="theme-switch__spot"></div>
//                     <div className="theme-switch__spot"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </label>
//         </button>
//       </div>
//       <div
//         className={
//           "fixed left-0 bg-[var(--body-bg)] pb-1 top-0 sm:top-[41px] transition-transform ease-in-out duration-700 " +
//           (nav ? " sm:translate-y-[-41px]" : " sm:translate-y-0")
//         }
//       >
//         <Navbar />
//       </div>
//     </header>
//   );
// };

export const SearchProductCard: React.FC<Ui.Product> = (data) => {
  const dispatch = useAppDispatch();
  const store = useAppSelector();

  const addProductToCartFn = async (data: Ui.Product) => {
    if (data.quantity <= 0)
      return toast.error("Product is out of stock.", {
        position: "top-right",
        icon: <Icons.avoid className="size-5" />,
      });
    const isProductExist = store?.cart?.products?.some(
      (product) => product.id === data.id
    );
    if (isProductExist) {
      return toast.success("Product already exists", {
        icon: <Icons.shoppingCart className="size-5" />,
        position: "top-right",
      });
    }
    const toastLoader = toast.loading("Loading...");

    try {
      await addProductToCart(store?.auth?.userInfo?.uid as string, data.id);
      dispatch(
        addToCart({
          id: data.id,
          name: data.name,
          price: data.price,
          quantity: 1,
          image: data.image,
        })
      );
      toast.dismiss(toastLoader);
      toast.success("Product added successfully.", {
        icon: <Icons.cartCheckout className="size-5" />,
        position: "top-right",
      });
    } catch (error) {
    } finally {
      toast.dismiss(toastLoader);
    }
  };

  return (
    <div
      key={data.id}
      className="w-full flex items-center gap-5 p-3 mb-4 bg-[var(--light-background)] border border-[var(--dark-border)] rounded-lg shadow-sm hover:shadow-md duration-150"
    >
      <img
        src={data.image}
        className="w-[60px] h-[60px] rounded-lg object-cover"
        alt={data.name}
      />
      <div className="flex-1">
        <h1 className="sm:text-[15px] text-[12px] font-medium tracking-wide text-[var(--dark-text)]">
          {data.name}
        </h1>
        <div className="flex items-center justify-start gap-2">
          <p
            className={`sm:text-[14px] text-xs text-[var(--dark-secondary-text)] `}
          >
            Rs.{data.price}
          </p>
          <p
            className={`  text-[10px] h-[20.3px]   ${
              data?.quantity < 20 && data.quantity !== 0
                ? "border border-orange-400 rounded-xl p-[1px] px-1 text-orange-400"
                : data.quantity <= 0
                ? "border border-red-500 rounded-xl p-[1px] px-1 text-red-500"
                : ""
            }`}
          >
            {" "}
            {data.quantity <= 20 ? ` low on stock` : ""}
          </p>
        </div>
        {data.tag && (
          <span className="text-[12px] text-[var(--primary-color)]">
            {data.tag}
          </span>
        )}
      </div>
      <button
        aria-labelledby="cart"
        aria-label="cart-button"
        className="bg-[var(--primary-color)] text-white py-2 px-2 sm:px-3 rounded-md hover:bg-[var(--primary-dark)] duration-150 sm:text-[14px]"
        onClick={() => addProductToCartFn(data)}
      >
        <Icons.cartCheckout
          id="cart"
          className="sm:size-6 size-5 text-[var(--dark-text)] "
        />
      </button>
    </div>
  );
};
