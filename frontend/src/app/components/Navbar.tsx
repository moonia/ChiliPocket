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
            <a href="/create-event" className="text-gray-300 hover:text-white transition-colors">Create your event</a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
          </li>
        </ul>

        {walletAddress ? (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-white bg-[#22c55e] rounded-full text-sm font-medium hover:bg-[#16a34a] transition-all"
            title="Click to copy address"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {truncateAddress(walletAddress)}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => connectWithMetamask()}
            className="px-8 py-2 text-white border border-[#ff004f] bg-[#ff004f] cursor-pointer rounded-full text-sm font-medium hover:text-[#ff004f] hover:bg-white hover:border-[#ff004f] transition-all"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
