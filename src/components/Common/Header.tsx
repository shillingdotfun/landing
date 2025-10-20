// src/components/layout/Header.tsx

import purpleLogo from "../../assets/images/shilling-logo/large/white-transparent.svg"
import PrivyLogin from "../Auth/PrivyLogin";

export const Header: React.FC = () => {
  return (
    <header className="flex w-full items-center justify-between p-4 lg:px-10 border-b border-b-purple-100/30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
          <img src={purpleLogo} className="max-h-12" />
        </div>
      </div>
      <nav className="flex gap-8">
        <PrivyLogin></PrivyLogin>
      </nav>
    </header>
  );
};

export default Header;