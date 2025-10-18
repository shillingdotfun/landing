import purpleLogo from "../../assets/images/shilling-logo/large/purple-transparent.png"

const Header: React.FC = () => (
  <header className="bg-[#0f0f14]/95 backdrop-blur-lg px-10 py-5 flex justify-between items-center border-b border-[#2a2a35] sticky top-0 z-50">
    <div className="flex items-center gap-4">
      <img src={purpleLogo} className="max-h-12" />
    </div>
    <nav className="flex gap-8">
      {['CAMPAIGNS', 'KOLS', 'LEADERBOARD', 'CREATE'].map((item, i) => (
        <a
          key={item}
          href="#"
          className={`text-[9px] px-4 py-2 transition-colors ${
            i === 0 ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-200'
          }`}
          
        >
          {item}
        </a>
      ))}
    </nav>
  </header>
);

export default Header;