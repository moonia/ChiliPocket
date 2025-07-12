import Head from 'next/head';
import Navbar from './components/Navbar';
import Partners from './components/Partners';
import Footbar from './components/Footbar';
import PlayersCards from './components/PlayersCards';

export default function Home() {
  return (
    <>
      <Head>
        <title>Feel the Game</title>
      </Head>
      <main className="bg-gradient-to-br from-[#0e0c26] to-[#19124b] text-white min-h-screen relative">
        {/* Blue background overlay at top */}
        <div 
          className="absolute top-0 left-0 w-full h-[1000px] opacity-60"
          style={{
            backgroundImage: 'url(/blue-background.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            background: 'linear-gradient(to bottom, url(/blue-background.png), transparent)'
          }}
        ></div>
        
        <div 
          className="absolute mt-80 top-[200px] left-0   h-[600px] opacity-50"
          style={{
            backgroundImage: 'url(/purple-background.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            background: 'linear-gradient(to bottom, url(/purple-background.png), transparent)'
          }}
        ></div>

        <div className="relative z-10">
          <Navbar/>
          <section className="text-center px-4 mt-16 py-20">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              FEEL THE GAME. EARN CARDS,<br /> SHARE THE PASSION
            </h1>
            <button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition rounded-full text-white text-sm font-semibold cursor-pointer">
              START COLLECTING
            </button>
            <div className="flex justify-center gap-12 mt-10 text-2xl font-medium">
              <div><span className="text-lg font-bold">9.5K+</span><br />EVENTS</div>
              <div><span className="text-lg font-bold">90K+</span><br />CARDS</div>
              <div><span className="text-lg font-bold">1K+</span><br />COMMUNITY</div>
            </div>
            <PlayersCards />
          </section>
          <Partners/>
          <section className="mt-24 text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10">PLAY, SCAN, COLLECT, PROGRESS</h2>

            <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-left">
              <div>
                <h3 className="text-lg font-semibold mb-2">Earn cards</h3>
                <p className="text-sm text-gray-300">by scanning match tickets, win quizzes, post on social media…</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Connect your wallet</h3>
                <p className="text-sm text-gray-300">1-click, ultra simple</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Collect & Rise</h3>
                <p className="text-sm text-gray-300">Show your cards, climb the ranks.</p>
              </div>
            </div>
          </section>
          <Footbar/>
        </div>
      </main>
    </>
  );
}
