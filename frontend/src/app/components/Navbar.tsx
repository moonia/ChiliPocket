const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4">
      <div className="text-xl font-bold">Logo</div>
      <ul className="flex gap-6">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">Collections</a></li>
        <li><a href="#" className="hover:underline">Scan</a></li>
        <li><a href="#" className="hover:underline">About</a></li>
      </ul>
      <button className="border border-white px-4 py-1 rounded-full text-sm hover:bg-white hover:text-black transition">
        Connect Wallet
      </button>
    </nav>
  )
};

export default Navbar;