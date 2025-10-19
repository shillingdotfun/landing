// src/components/layout/Header.tsx

import purpleLogo from "../../assets/images/shilling-logo/large/purple-transparent.png"
import PrivyLogin from "../Auth/PrivyLogin";

export const Header: React.FC = () => {
  return (
    <header className="flex w-full items-center justify-between p-4 lg:px-10 border-b border-b-purple-700">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
          <img src={purpleLogo} className="max-h-12" />
        </div>
      </div>
      <nav className="flex gap-8">
        {[
          { label: 'CAMPAIGNS', href: '/' },
          { label: 'KOLS', href: '/kols' },
          { label: 'LEADERBOARD', href: '/leaderboard' },
          { label: 'CREATE', href: '/create' }
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`text-[9px] px-4 py-2 transition-colors`}
          >

            {item.label}
          </a>
        ))}
        <PrivyLogin></PrivyLogin>
      </nav>
    </header>
  );
};

export default Header;