// src/components/layouts/PublicLayout.tsx
import React, { useState } from 'react'
import { FaHouse, FaPeopleGroup, FaCrown, FaPlus } from 'react-icons/fa6'

import { useAuth } from '../../../hooks/useAuth'

import Header from '../Header'
import Sidebar from '../Sidebar'


type LayoutProps = {
  children: React.ReactNode
}

const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sidebarIsVisible, setSidebarIsVisible] = useState<boolean>(false)
  
  const menuItems = [
    { name: 'Home', path: '/', icon: <FaHouse />},
    { name: 'KOLs', path: '/kols', icon: <FaCrown/> },
    { name: 'Campaigns', path: '/campaigns', icon: <FaPeopleGroup /> },
    { name: 'Create', path: '/campaigns/create', icon: <FaPlus /> }
  ]

  // Close sidebar explicitly
  const closeSidebar = () => {
    setSidebarIsVisible(false)
  }

  return (
    <div className={`flex ${!isAuthenticated ? 'flex-col' : 'flow-row'} relative z-2 h-screen overflow-hidden m-0 bg-blue-900 text-purple-100 font-anek-latin`}>
        {!isAuthenticated ? (
          <Header/>
        ) : (
          <Sidebar 
            show={sidebarIsVisible} 
            menuItems={menuItems} 
            onClose={closeSidebar} 
          />
        )}
        <main className="sm:px-8 px-4 w-full h-screen overflow-y-scroll">
          <div className='mx-auto'>
            {children}
          </div>
        </main>
    </div>
  )
}

export default PublicLayout
