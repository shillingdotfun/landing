// src/components/layout/Header.tsx

import purpleLogo from "../../assets/images/shilling-logo/large/purple-transparent.png"

export const Header: React.FC = () => {
  return (
    <header className="bg-[#0f0f14]/95 backdrop-blur-lg px-10 py-5 flex justify-between items-center border-b border-[#2a2a35] sticky top-0 z-50">
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
      </nav>
    </header>
  );
};

export default Header;