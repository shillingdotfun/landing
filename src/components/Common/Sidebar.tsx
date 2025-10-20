// src/components/layouts/private/Sidebar.tsx

import React, { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GrLogout } from "react-icons/gr";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

import longLogoBlack from "../../assets/images/shilling-logo/large/white-transparent.svg"
import smallBlackLogo from "../../assets/images/shilling-logo/small/white.svg"
import useIsMobile from '../../hooks/useIsMobile';
import { useAuth } from '../../hooks/useAuth';

type SidebarProps = {
  menuItems: { name: string; path: string; icon?: ReactNode }[];
  show: boolean;
  onClose: () => void;
}
  
const Sidebar: React.FC<SidebarProps> = ({ menuItems, show, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(isMobile ? false : true);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <aside 
      className={`
        bg-purple-700
        bg-[#3e2b56]
        fixed sm:static z-40 h-screen flex flex-col transition-[width,transform] duration-300 ease-in-out
        ${show ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        ${isCollapsed ? 'sm:w-20' : 'sm:w-[260px]'}
        w-[80%]
      `}
      style={{ willChange: 'width' }}
    >     
      {/* logo */} 
      <div className={`flex mb-8 justify-between items-center mt-4 px-4 py-4 min-h-[80px]`}>
        <div className="flex items-center w-full overflow-hidden">
          {!isCollapsed ? (
            <img
              onClick={() => navigate('/dashboard')}
              src={longLogoBlack}
              alt="Logo"
              className="h-12 px-4 cursor-pointer transition-opacity duration-300"
            />
          ) : (
            <img
              onClick={() => navigate('/dashboard')}
              src={smallBlackLogo}
              alt="Logo"
              className="h-8 cursor-pointer transition-opacity duration-300 mx-auto"
            />
          )}
        </div>
        
        {/* Close button for responsive */}
        <button 
          className='sm:hidden block rounded-lg flex-shrink-0' 
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Collapse button */}
      <div 
        onClick={toggleCollapse}
        className='hidden sm:block rounded bg-[#3e2b56] border border-purple-100/20 absolute z-[100] -right-3 top-10 p-1 cursor-pointer transition-colors'>
        {isCollapsed ? <FaAngleRight className='text-xs'/> : <FaAngleLeft className='text-xs'/>}
      </div>
      
      {/* Menu */}
      <div className='flex flex-col justify-between flex-grow'>
        <ul className='px-4'>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block mb-2 group relative rounded-md transition-colors duration-200 hover:text-purple-700 ${
                  location.pathname === item.path ? "bg-purple-300 text-purple-700" : "hover:bg-purple-300"
                }`}
                onClick={() => {
                  if (window.innerWidth < 640) {
                    onClose();
                  }
                }}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`flex flex-row items-center gap-2 p-2 ${
                  isCollapsed ? 'justify-center items-center text-center' : 'justify-start'
                }`}>
                  {/* Icon */}
                  <span className={`flex-shrink-0 ${isCollapsed ? 'sm:text-xl' : ''}`}>
                    {item.icon}
                  </span>
                  
                  {/* Text */}
                  <span className={`overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
                    isCollapsed ? 'hidden' : 'opacity-100'
                  }`}>
                    {item.name}
                  </span>
                </div>
                
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="hidden bg-purple-600 sm:block absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap text-purple-100">
                    {item.name}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Footer with logout */}
        {isAuthenticated && (
          <div className='px-4'>
            <a
              className={`block mb-2 group relative rounded-md transition-colors duration-200 hover:bg-purple-300`}
              href="#"
              title={isCollapsed ? "Logout" : undefined}
              rel="noopener"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <div className={`flex flex-row items-center gap-2 p-2 ${
                isCollapsed ? 'justify-center items-center text-center' : 'justify-start'
              }`}>
                {/* Icon */}
                <span className={`flex-shrink-0 ${isCollapsed ? 'sm:text-xl' : ''}`}>
                  <GrLogout/>
                </span>
                
                {/* Text */}
                <span className={`overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
                  isCollapsed ? 'hidden' : 'opacity-100'
                }`}>
                  Logout
                </span>
              </div>
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="hidden bg-purple-600 sm:block absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap text-purple-100">
                  Logout
                </div>
              )}
            </a>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar;