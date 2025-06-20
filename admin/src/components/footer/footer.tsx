import CollegeLogo from "@/assets/logo/texas.png";
import { Icons } from "@/utils";

const Footer: React.FC = () => {
  return (
    <div className="flex flex-col w-full text-white">
      <footer className="w-full mt-16  rounded-t  bg-[var(--primary-color)] text-white place-items-center grid px-5">
        <div className="flex flex-col items-center justify-between w-full gap-5 p-3 border-b-4 border-b-[var(--light-border)] sm:flex-row">
          <div className="px-5 py-3 bg-[var(--light-background)] rounded">
            <img src={CollegeLogo} className="max-h-[60px] " />
          </div>
          <div className="flex flex-col gap-3 justify-center items-center">
            <p className="text-lg font-bold tracking-wide">Follow us: </p>
            <div className="flex gap-9 items-center">
              <a
                aria-label="go to facebook"
                target="_blank"
                href="https://www.facebook.com/texasintlcollege"
              >
                <Icons.facebook className="sm:size-6 size-5 duration-150 hover:text-[var(--secondary-color)] " />
              </a>
              <a
                aria-label="go to instagram"
                href="https://www.instagram.com/texasinternationalcollege/"
                target="_blank"
              >
                <Icons.instagram className="sm:size-6 size-5 duration-150 hover:text-[var(--secondary-color)] " />
              </a>
              <a
                aria-label="go to linkedin"
                href="https://www.linkedin.com/company/texas-college-of-management-it/"
                target="_blank"
              >
                <Icons.linkedin className="sm:size-6 size-5 duration-150 hover:text-[var(--secondary-color)] " />
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 py-4 w-full md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6 p-8">
            <p className="font-bold tracking-wider">Quick Contact</p>
            <div className="flex flex-col gap-5">
              <div className="flex gap-2 items-center text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center">
                  <Icons.mapMarker />
                </div>
                <div>
                  <p>Sifal, Chabahil</p>
                  <p>Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center flex-wrap">
                  <Icons.phone />
                </div>
                <div>
                  <p>01-4589134, 01-4588627, 9801644462</p>
                </div>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center">
                  <Icons.email />
                </div>
                <div>
                  <a
                    href="mailto:inquiry@texascollege.edu.np"
                    className="break-all text-wrap"
                  >
                    inquiry@texascollege.edu.np
                  </a>
                </div>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center">
                  <Icons.clock />
                </div>
                <div>
                  <p>Opening Hour</p>
                  <p>06:00 AM - 06:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center px-5 py-8">
            <p className="font-bold tracking-wider">Links</p>
            <div className="flex flex-col gap-3 text-sm text-white">
              <a
                href="/"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Dashboard
              </a>
              <a
                href="/collection/foodlist"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Product
              </a>
              <a
                href="/order-list"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Orders
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-5 px-5 py-8">
            <p className="font-bold tracking-wider">Quick Links</p>
            <div className="flex flex-col gap-3 text-sm text-white">
              <a
                target="_blank"
                href="mail:enquiry@texasintl.edu.np"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                enquiry@texasintl.edu.np
              </a>
              <a
                target="_blank"
                href="https://texasintl.edu.np/"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Texas International College
              </a>
              <a
                target="_blank"
                href="https://texascollege.edu.np/"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Texas College of IT and Management
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center px-5 py-8">
            <p className="font-bold tracking-wider">Resources</p>
            <div className="flex flex-col gap-5 pl-9 text-sm text-white">
              <a
                href="/"
                target="_blank"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Terms & Condition
              </a>
              <a
                target="_blank"
                href="/"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full flex justify-between flex-col md:flex-row py-4 px-5 text-sm text-[var(--dark-secondary-text)] gap-3 items-center">
        <p>Copyright © 2024 All Rights Reserved.</p>
        <p className="cursor-pointer">
          Developed By:{" "}
          <a
            href="https://saroj-gt.web.app/"
            target="_blank"
            className="hover:text-[var(--primary-color)]  hover:underline "
          >
            Saroj
          </a>{" "}
          and{" "}
          <a
            href="https://aayush-al.web.app/"
            target="_blank"
            className="hover:text-[var(--primary-color)]  hover:underline"
          >
            Aayush.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
