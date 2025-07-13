const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f0c29]/80 backdrop-blur-md px-6 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="/">
            <img src="/chili-pocket.png" alt="ChiliPocket Logo" className="h-10 w-auto drop-shadow" />
          </a>
        </div>

        <ul className="hidden md:flex gap-6 text-sm font-normal absolute left-1/2 -translate-x-1/2">
          <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
          <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Collections</a></li>
          <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Scan</a></li>
          <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
        </ul>

        <button className="px-8 py-2 text-white border border-[#ff004f] bg-[#ff004f] rounded-full text-sm font-medium hover:text-[#ff004f] hover:bg-white hover:border-[#ff004f] transition-all">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default Navbar;