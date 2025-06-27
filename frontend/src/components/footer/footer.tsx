import React from "react";
import { Icons } from "@/utils";

const links: { icon: React.ReactNode; href: string; title?: string }[] = [
  {
    href: "https://www.linkedin.com/company/texas-college-of-management-it/",
    icon: (
      <Icons.linkedin className="sm:size-5 size-4 duration-150 text-[var(--primary-color)] " />
    ),
    title: "Linkedin",
  },
  {
    href: "https://www.facebook.com/texasintlcollege",
    icon: (
      <Icons.facebook className="sm:size-5 size-4 duration-150 text-[var(--primary-color)] " />
    ),
    title: "Facebook",
  },

  {
    href: "https://www.instagram.com/texasinternationalcollege/",
    icon: (
      <Icons.instagram className="sm:size-5 size-4 duration-150 text-[var(--primary-color)] " />
    ),
    title: "Instagram",
  },
];
export const Footer: React.FC = () => {
  return (
    <div className="flex  flex-col w-full  text-white ">
      <footer className="w-full mt-5    rounded-t  bg-[var(--primary-color)] text-white place-items-center sm:grid px-5">
        <div className="w-full flex  items-start sm:items-center sm:justify-evenly justify-between flex-wrap  ">
          <div className="flex sm:col-span-1 col-span-3 flex-col gap-6 p-8 ">
            <p className="font-bold tracking-wider">Quick Contact</p>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center">
                  <Icons.mapMarker />
                </div>
                <div>
                  <p>Sifal, Chabahil</p>
                  <p>Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="p-2 bg-[var(--light-foreground)] rounded-full text-[var(--dark-secondary-text)] flex items-center justify-center flex-wrap">
                  <Icons.phone />
                </div>
                <div>
                  <p>01-4589134, 01-4588627, 9801644462</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
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
              <div className="flex items-center gap-2 text-sm">
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
          <div className="flex flex-col items-start gap-5 px-5 py-8">
            <p className="font-bold tracking-wider">Links</p>
            <div className="flex flex-col gap-3 text-sm text-white ">
              <a
                href="/"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Home
              </a>
              <a
                href="/checkout"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Cart
              </a>
              <a
                href="/orders"
                className="cursor-pointer hover:underline hover:text-[var(--secondary-color)]"
              >
                Orders
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-5 px-5 py-8">
            <p className="font-bold tracking-wider">Resources</p>
            <div className="flex flex-col gap-5 text-sm text-white">
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
        <div className="flex py-2 items-center justify-end w-full gap-3">
          <p className="sm:text-lg text-sm font-semibold tracking-wide ">Connect With Us : </p>
          <div className="flex items-center gap-4">
            {links?.map((link, index) => (
              <Link
                href={link.href}
                key={index}
                icon={link.icon}
                title={link.title}
              />
            ))}
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

interface LinkProp {
  href: string;
  title?: string;
  icon?: React.ReactNode;
}

const Link: React.FC<LinkProp> = ({ href, icon, title }) => {
  return (
    <div className="flex z-[100] sm:z-[1900] items-center gap-9">
      <a aria-label={`Go to ${title}`} target="_blank" href={href}>
        <button className=" bg-white p-1.5 rounded-full ">{icon}</button>
      </a>
    </div>
  );
};
