// src/components/layouts/PrivateLayout.tsx
import React, { useState } from 'react'

import { FaCrown, FaHouse, FaPeopleGroup, FaPlus } from 'react-icons/fa6';
import { GrMenu } from "react-icons/gr";

import Sidebar from '../Sidebar';

type LayoutProps = {
  pageTitle: string,
  children: React.ReactNode
}

const PrivateLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarIsVisible, setSidebarIsVisible] = useState<boolean>(false)
  
  const menuItems = [
    { name: 'Home', path: '/', icon: <FaHouse />},
    { name: 'KOLs', path: '/kols', icon: <FaCrown/> },
    { name: 'Campaigns', path: '/campaigns', icon: <FaPeopleGroup /> },
    { name: 'Create', path: '/create', icon: <FaPlus /> }
  ]

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarIsVisible(!sidebarIsVisible)
  }

  // Close sidebar explicitly
  const closeSidebar = () => {
    setSidebarIsVisible(false)
  }

  return (
    <div className="flex relative z-2 h-screen overflow-hidden m-0 bg-blue-900 text-purple-100 font-anek-latin">
      {/* Overlay to close the sidebar when the user clicks outside (just for mobile) */}
      {sidebarIsVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <Sidebar 
        show={sidebarIsVisible} 
        menuItems={menuItems} 
        onClose={closeSidebar} 
      />
      
      <main className="sm:px-8 py-[3vh] px-4 w-full h-screen overflow-y-scroll">
        <div className='xl:max-w-[1250px] mx-auto'>
        {/* header */}
        <div className='flex flex-row justify-between mb-4 rounded-lg'>
          {!sidebarIsVisible &&
            <button 
              className='sm:hidden block p-2 bg-palette-primary rounded-tr-lg rounded-br-lg' 
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {sidebarIsVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <GrMenu className='text-4xl' />
              )}
            </button>
          }
        </div>
        {/* body */}
        {children}
        </div>
      </main>
    </div>
  )
}

export default PrivateLayout