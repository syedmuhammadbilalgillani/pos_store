import { Dialog, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Sidebar } from "./Sidebar";
import { NavigationItem, Team } from "./types";

interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigation: NavigationItem[];
  teams: Team[];
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  navigation,
  teams,
}) => {
  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 lg:hidden"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-gray-900/80"
          />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    {/* <XMarkIcon
                      className="size-6 text-white"
                      aria-hidden="true"
                    /> */}
                  </button>
                </div>
              </Transition.Child>
              <Sidebar navigation={navigation} teams={teams} />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
