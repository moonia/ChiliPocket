import Head from 'next/head';
import Navbar from './components/Navbar';
import Partners from './components/Partners';
import Footbar from './components/Footbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>Feel the Game</title>
      </Head>
      <main className="bg-gradient-to-br from-[#0e0c26] to-[#19124b] text-white min-h-screen">
        <Navbar/>
        <section className="text-center px-4 mt-16">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            FEEL THE GAME. EARN CARDS,<br /> SHARE THE PASSION
          </h1>
          <button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition rounded-full text-white text-sm font-semibold">
            START COLLECTING
          </button>
          <div className="flex justify-center gap-12 mt-10 text-sm font-medium">
            <div><span className="text-lg font-bold">9.5K+</span><br />EVENTS</div>
            <div><span className="text-lg font-bold">90K+</span><br />CARDS</div>
            <div><span className="text-lg font-bold">1K+</span><br />COMMUNITY</div>
          </div>

          {/* Cards carousel (placeholder) */}
          <div className="mt-16 relative flex justify-center gap-4">
            <div className="w-[120px] h-[180px] bg-gray-700 rounded-lg opacity-60">Card 1</div>
            <div className="w-[140px] h-[200px] bg-gray-500 rounded-lg z-10 scale-110">Card 2</div>
            <div className="w-[120px] h-[180px] bg-gray-700 rounded-lg opacity-60">Card 3</div>
          </div>
          <p className="mt-4 text-sm opacity-60">A project made with blockchain and love</p>
        </section>
        <Partners/>
        {/* Features */}
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
      </main>
    </>
  );
}
