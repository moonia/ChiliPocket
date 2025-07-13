import { FaDiscord, FaTelegramPlane, FaGithub } from 'react-icons/fa';

const Footbar = () => {
  return (
    <footer className="bg-[#0f0c29] text-sm text-gray-400 px-6 pt-16 pb-10 mt-32 border-t border-[#232334]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-12 mb-16">
          <div className="text-sm md:text-base">
            <h4 className="text-xs text-[#c084fc] uppercase mb-2">ChiliPocket</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-medium text-gray-500">
              <a href="#">Submit a POAP</a>
              <a href="/about">About</a>
              <a href="#">Report a Security Issue</a>
            </div>
          </div>

          <div className="text-sm md:text-sm text-gray-700">
            <h4 className="text-xs text-[#c084fc] uppercase mb-2">Policies</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-medium text-gray-500">
              <a href="#">Terms of Use</a>
              <a href="#">Cookies Policy</a>
              <a href="#">Manage Cookies</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          <div className="text-xs md:text-xs text-gray-600">
            <h4 className="text-[11px] text-[#c084fc] uppercase mb-2 tracking-wide">Support</h4>
            <p className="font-medium text-gray-500">support@chilipocket.xyz</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-[#232334] pt-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight md:leading-snug">
            OWN THE MOMENT.<br className="hidden md:block" />
            COLLECT THE PROOF.
          </h2>

          <div className="mt-8 md:mt-0 flex flex-col items-start md:items-end text-xs text-gray-400">
            <div className="flex items-center gap-2 mb-2">
              <img src="/chili-pocket.png" alt="Logo" className="h-5 opacity-60" />
              <span>&copy; 2025 ChiliPocket — All Rights Reserved</span>
            </div>

            <div className="flex flex-wrap gap-4 text-lg text-white mt-2">
              <a href="#"><FaDiscord /></a>
              <a href="#"><FaTelegramPlane /></a>
              <a href="https://github.com/moonia/ChiliPocket"><FaGithub /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footbar;
