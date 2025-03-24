import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "./className";
import { NavigationItem } from "./types";
import { useState } from "react";
import TranslatedText from "../Language/TranslatedText";

interface NavigationProps {
  items: NavigationItem[];
}

export const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname.startsWith("/dashboard")
            : pathname.startsWith(item.href);

        const hasSubMenu = item.subItems && item.subItems.length > 0;
        const isSubmenuOpen = openSubmenu === item.name;

        return (
          <li key={item.name}>
            <div className="flex flex-col">
              <div className="flex items-center">
                <Link
                  href={hasSubMenu ? "#" : item.href}
                  onClick={
                    hasSubMenu ? () => toggleSubmenu(item.name) : undefined
                  }
                  className={classNames(
                    isActive
                      ? "bg-gray-900 text-white dark:bg-gray-700 dark:text-white"
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#21242E] hover:text-black dark:hover:text-white",
                    "group flex flex-grow gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-all duration-200 ease-in-out"
                  )}
                >
                  {item.icon && (
                    <span
                      className={classNames(
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-black dark:group-hover:text-white",
                        "size-6 shrink-0 transition-colors duration-200"
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <TranslatedText textKey={item.name} />

                  {hasSubMenu && (
                    <span className="ml-auto transform transition-transform duration-200 ease-in-out">
                      <svg
                        className={`h-5 w-5 transition-all duration-200 ${
                          isSubmenuOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  )}
                </Link>
              </div>

              {hasSubMenu && (
                <div
                  className={`ml-6 pl-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    isSubmenuOpen
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-1 py-1">
                    {item.subItems?.map((subItem) => {
                      const isSubItemActive = pathname === subItem.href;

                      return (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={classNames(
                              isSubItemActive
                                ? "bg-gray-300 text-black dark:bg-gray-600 dark:text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-black dark:hover:bg-[#21242E] dark:hover:text-white",
                              "group flex gap-x-3 rounded-md p-2  text-sm font-medium transition-all duration-200"
                            )}
                          >
                            {subItem.icon && (
                              <span
                                className={classNames(
                                  isSubItemActive
                                    ? "text-black dark:text-white"
                                    : "text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white",
                                  "size-5 shrink-0 transition-colors duration-200"
                                )}
                              >
                                {subItem.icon}
                              </span>
                            )}
                            <TranslatedText textKey={subItem.name} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
