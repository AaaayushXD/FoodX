import {
  MdHistory,
  MdLightMode,
  MdDarkMode,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlineShoppingCartCheckout,
} from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { GiRingingBell, GiTakeMyMoney, GiTomato } from "react-icons/gi";
import {
  IoLogOutOutline,
  IoFilter,
  IoShareSocialOutline,
  IoHomeOutline,
  IoCallOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  FaChevronUp,
  FaXTwitter,
  FaArrowRightLong,
  FaNewspaper,
} from "react-icons/fa6";
import { RiMenu2Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { PiShippingContainer } from "react-icons/pi";
import { BiDotsVerticalRounded, BiSupport } from "react-icons/bi";

import {
  FaChevronDown,
  FaChevronRight,
  FaCloudDownloadAlt,
  FaPaperPlane,
  FaRegUserCircle,
  FaSortAlphaUpAlt,
} from "react-icons/fa";
import {
  IoSettingsOutline,
  IoBagCheckOutline,
  IoCartOutline,
} from "react-icons/io5";
import { CgUnavailable } from "react-icons/cg";
import { LiaTimesSolid } from "react-icons/lia";
import {
  FaEdit,
  FaFrown,
  FaMinus,
  FaPlus,
  FaTrashRestore,
  FaRedoAlt,
  FaRegClock,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserEdit,
  FaChevronLeft,
} from "react-icons/fa";
import { LuEyeClosed, LuEye, LuStar } from "react-icons/lu";
import {
  MdOutlineDisplaySettings,
  MdOutlineShoppingBag,
  MdEmail,
} from "react-icons/md";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  Clipboard,
  ClipboardCheck,
  CookingPot,
  GitPullRequest,
  Heart,
  LoaderCircle,
  Redo,
} from "lucide-react";

export const EditProfileIcon: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] ] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--dark-border)] ">
      <p className="text-xs ">Edit</p>
      <Icons.edit size={15} />
    </div>
  );
};
export const UpdateUser: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--light-border)] ">
      <p className="text-xs">Save</p>
      <Icons.edit size={15} />
    </div>
  );
};

const Filter: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--light-border)] ">
      <p className="text-xs">Filter</p>
      <Icons.filter size={15} />
    </div>
  );
};
const Sort: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--light-border)] ">
      <p className="text-xs">Sort</p>
      <Icons.sort size={15} />
    </div>
  );
};

export const AddToCart = () => {
  return (
    <button className="text-[20px] w-[100px] rounded-md tracking-wider  py-2 flex items-center justify-center text-white font-bold bg-gradient-to-t from-[var(--primary-color)] to-[var(--primary-light)] ">
      ADD{" "}
    </button>
  );
};

export const LeftArrow = ({ className }: { className?: string }) => {
  return (
    <div className="w-full flex items-center justify-start">
      <button
        className={`${className}hover:bg-[#666a752a]  duration-150  rounded-full p-1.5`}
      >
        <ArrowLeft className="size-6 sm:size-7  text-gray-400  " />{" "}
      </button>
    </div>
  );
};
export const RightArrow = ({ className }: { className?: string }) => {
  return (
    <button className={` hover:bg-[#666a752a] duration-150 rounded-full p-1.5`}>
      <ArrowRight className="size-6 sm:size-7  text-white " />{" "}
    </button>
  );
};

export const FontAwesomeIcons = {
  logout: IoLogOutOutline,
  history: MdHistory,
  delete: FaTrashRestore,
  displaySetting: MdOutlineDisplaySettings,
  chevronDown: FaChevronDown,
  chevronLeft: FaChevronLeft,
  arrowDown: MdOutlineKeyboardArrowDown,
  arrowUp: MdOutlineKeyboardArrowUp,
  arrowLeft: LeftArrow,
  arrowRight: RightArrow,
  chevronRight: FaChevronRight,
  chevronUp: FaChevronUp,
  bell: GiRingingBell,
  darkMode: MdDarkMode,
  lightMode: MdLightMode,
  plus: FaPlus,
  minus: FaMinus,
  shoppingBag: MdOutlineShoppingBag,
  shoppingCart: IoCartOutline,
  heart: Heart,
  redo: Redo,
  clock: FaRegClock,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  mapMarker: FaMapMarkerAlt,
  email: MdEmail,
  phone: FaPhoneAlt,
  menu: RiMenu2Line,
  close: LiaTimesSolid,
  search: FiSearch,
  user: FaRegUserCircle,
  setting: IoSettingsOutline,
  cartCheckout: IoBagCheckOutline,
  avoid: CgUnavailable,
  home: IoHomeOutline,
  eyeOpen: LuEye,
  eyeClose: LuEyeClosed,
  userEdit: FaUserEdit,
  frown: FaFrown,
  edit: FaEdit,
  send: FaPaperPlane,
  download: FaCloudDownloadAlt,
  money: GiTakeMyMoney,
  total: PiShippingContainer,
  updateProfile: UpdateUser,
  cook: CookingPot,
  editProfile: EditProfileIcon,
  ellipse: BiDotsVerticalRounded,
  filter: IoFilter,
  sort: FaSortAlphaUpAlt,
  filterButton: Filter,
  sortButton: Sort,
  share: IoShareSocialOutline,
  star: LuStar,
  tomato: GiTomato,
  reOrder: MdOutlineShoppingCartCheckout,
  password: TbLockPassword,
  call: IoCallOutline,
  support: BiSupport,
  addToCart: AddToCart,
  alert: AlertCircle,
  alertTraingle: AlertTriangle,
  bill: FaNewspaper,
  copy: Clipboard,
  check: Check,
  request: GitPullRequest,
  warning: IoWarningOutline,
  cancel: Ban,
  loading: LoaderCircle,
  clibBoardCheck: ClipboardCheck,
};

export const Icons = {
  ...FontAwesomeIcons,
};
