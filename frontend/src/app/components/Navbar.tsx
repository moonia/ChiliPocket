"use client";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { useState } from "react";

const Navbar = () => {
  const connectWithMetamask = useMetamask();
  const walletAddress = useAddress();
  const [copied, setCopied] = useState(false);

  const truncateAddress = (address:any) =>
    address?.slice(0, 6) + "..." + address?.slice(-4);

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f0c29]/80 backdrop-blur-md px-6 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <a href="/">
            <img
              src="/chili-pocket.png"
              alt="ChiliPocket Logo"
              className="h-10 w-auto drop-shadow"
            />
          </a>
        </div>

        <ul className="hidden md:flex gap-6 text-sm font-normal absolute left-1/2 -translate-x-1/2">
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Collections</a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Scan</a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
          </li>
        </ul>

        {walletAddress ? (
          <button
            onClick={handleCopy}
            className="px-6 py-2 text-white bg-[#22c55e] rounded-full text-sm font-medium hover:bg-[#16a34a] transition-all"
            title="Cliquer pour copier l’adresse"
          >
            {copied ? "Copied!" : truncateAddress(walletAddress)}
          </button>
        ) : (
          <button
            onClick={connectWithMetamask}
            className="px-8 py-2 text-white border border-[#ff004f] bg-[#ff004f] rounded-full text-sm font-medium hover:text-[#ff004f] hover:bg-white hover:border-[#ff004f] transition-all"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
