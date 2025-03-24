"use client";
// import {
//   Bars3Icon,
//   BellIcon,
//   MagnifyingGlassIcon,
//   PowerIcon,
// } from "@heroicons/react/24/outline";
import { UserNavigationItem } from "./types";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import Link from "next/link";
// import { signOut } from "next-auth/react";
// import Image from "next/image";
import ThemeSwitch from "../ThemeSwitcher";
import LanguageSwitcher from "../Language/LanguageSwitcher";
interface HeaderProps {
  userNavigation: UserNavigationItem[];
  onSidebarOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  // userNavigation,
  onSidebarOpen,
}) => (
  // <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
  <div className="sticky top-0 z-40  py-2 px-2 bg-[#D1D5DC]  dark:bg-black">
    <div className="flex h-16 items-center gap-x-4  rounded-lg bg-white shadow dark:bg-[#15181E] dark:text-[#ECDFCC] text-[#21242E]  px-4  sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
      <button
        type="button"
        onClick={onSidebarOpen}
        className="-m-2.5 p-2.5 text-gray-700 cursor-pointer lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <i className="fa-duotone fa-solid fa-bars-staggered text-2xl"></i>{" "}
      </button>
      <div className="flex gap-2 justify-end w-full mx-2">
        <LanguageSwitcher />
        <ThemeSwitch />
      </div>
      {/*  
      <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form action="#" method="GET" className="grid flex-1 grid-cols-1">
          <input
            name="search"
            type="search"
            placeholder="Search"
            aria-label="Search"
            className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
          />
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="size-6" />
          </button>

          <div
            aria-hidden="true"
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
          />
          <button
           
          >
            <PowerIcon color="gray" aria-hidden="true" className="size-6" />
          </button>
          <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>

              <PowerIcon color="gray" aria-hidden="true" className="size-6" />
            </MenuButton>
           <MenuButton className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              {/* <Image
                alt=""
                src="/api/placeholder/32/32"
                className="size-8 rounded-full bg-gray-50"
              /> 
              <span className="hidden lg:flex lg:items-center">
                <span
                  aria-hidden="true"
                  className="ml-4 text-sm/6 font-semibold text-gray-900"
                >
                  Tom Cook
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="ml-2 size-5 text-gray-400"
                />
              </span>
            </MenuButton> 
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                  >
                    {item.name}
                  </Link>
                </MenuItem>
              ))}
              <MenuItem></MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>*/}
    </div>
  </div>
);
