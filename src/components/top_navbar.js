import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  BookOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TopNavbar({ navigation_items, show_title }) {
  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <BookOpenIcon
                  className="size-8 text-gray-400 hover:text-white"
                  aria-hidden="true"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation_items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative rounded-full bg-gray-800 p-1 hover:text-white">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon
                      aria-hidden="true"
                      className="size-8 text-gray-400 focus:text-white"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <a
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation_items.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {show_title && (
        <header className="bg-gray-700 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">
              {navigation_items.find((item) => item.current)?.name}
            </h1>
          </div>
        </header>
      )}
      
    </div>
  );
}
