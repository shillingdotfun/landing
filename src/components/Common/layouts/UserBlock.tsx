import { useEffect } from 'react';
import { SlUser } from "react-icons/sl";
import { useAuth } from '../../../hooks/useAuth';
import ContextMenu from '../menus/ContextMenu';

const UserBlock: React.FC<{className?: string, hasMenu: boolean, hasBorder: boolean}> = ({ className, hasMenu, hasBorder }) => {
  const { userProfile, loadUserProfile, logout } = useAuth();

  useEffect(() => {
    loadUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function makeid(length: number) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

  const options = [
    { label: 'Profile', href: '/profile', isExternal: false },
    { label: 'Logout', href: '#', isExternal: false, handler: logout },
    { label: 'Help & Support', href: import.meta.env.VITE_SUPPORT_URL ?? '#', isExternal: true },
  ];

  return (
    <div className={`${hasBorder ? 'border' : ''} ${className ?? ''}`}>
      {hasMenu ? (
        <ContextMenu
          button={
            <div className='flex flex-row items-center gap-2 justify-end'>
              <p className='font-semibold font-anek-latin'>{userProfile?.name ?? makeid(10)}</p>
              <span 
                className='inline-block border border-black p-2 bg-black rounded-full shadow-md' 
                aria-expanded="false" 
                aria-haspopup="true"
              >
                <SlUser className='text-white' />
              </span>
            </div>
          }
          options={options}
        />
      ) : (
        <div className='flex flex-row items-center gap-2'>
          <span 
            className='inline-block border p-2 rounded-full border-black' 
            aria-expanded="false" 
            aria-haspopup="true"
          >
            <SlUser color='black' />
          </span>
          <p className='font-semibold font-anek-latin'>{userProfile?.name ?? makeid(10)}</p>
        </div>
      )}

    </div>
  );
};

export default UserBlock;
