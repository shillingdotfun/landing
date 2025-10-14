import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import mainLogo from '../../assets/images/sample-logo-main.svg'
import { Button } from './Button'

const navigation = [
  { name: 'About', href: 'https://sample.gitbook.io/doc/1.-project-overview', current: false },
  { name: 'Whitepaper', href: 'https://sample.gitbook.io/doc/4.-tokenomics', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TopNav() {
  return (
    <Disclosure as="nav">
      <div className="mx-auto px-2 w-full max-w-screen-2xl sm:px-6 lg:px-12">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-between">
            {/* Logo */}
            <div className="flex shrink-0 items-center p-2 lg:p-0">
              <img
                alt="sample Agency"
                src={mainLogo}
                className="h-8 w-auto"
              />
            </div>
            {/* Nav */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium self-center',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
                <Button variant="dark" href="#">Launch App</Button>
              </div>
            </div>
          </div>
          {/* Burger menu */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-8 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-8 group-data-[open]:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
