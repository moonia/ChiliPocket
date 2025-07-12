import Image from 'next/image';

export default function PlayersCards() {
  const players = [
    { name: 'Yamal', src: '/playersCards/yamal.png', width: 450, height: 300 },
    { name: 'Hakimi', src: '/playersCards/hakimi.png', width: 500, height: 400 },
    { name: 'Mbappe', src: '/playersCards/mbappe.png', width: 450, height: 300 },
  ];

  return (
    <div className="mt-16 flex justify-center items-center  w-full max-w-4xl mx-auto">
      {players.map((player) => (
        <div key={player.name} className={`w-[${player.width}px] h-[${player.height}px]`}>
          <Image
            width={player.width}
            height={player.height}
            src={player.src}
            alt={`${player.name} Card`}
            className="object-cover rounded-xl w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}
