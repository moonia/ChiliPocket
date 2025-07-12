"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";

const Partners = () => {
  const partners = [
    { name: "Barcelona", logo: "/partnersLogos/barcelona.png" },
    { name: "Juventus", logo: "/partnersLogos/juventus.png" },
    { name: "PSG", logo: "/partnersLogos/psg.png" },
    { name: "Ligue 1", logo: "/partnersLogos/ligue-1.png" },
    { name: "K-League", logo: "/partnersLogos/k-league.png" },
    { name: "Exaion", logo: "/partnersLogos/exaion.png" },
  ];

  return (
    <div>
      <div className="text-center mb-4">
        <h2 className="text-[12px] font-light mb-4 text-purple-300">
          A project made with{" "}
          <span className="inline-block">
            <Image
              src="/chiliz-logo.png"
              alt="Chiliz"
              width={30}
              height={30}
              className="inline-block mx-2"
            />
          </span>
          blockchain and love
        </h2>
      </div>
      <div className="bg-gradient-to-r from-[#2d1b69] to-[#4c1d95] py-2 px-8">
        <Marquee speed={50} gradient={false} className="opacity-90">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="mx-8 flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={120}
                className="object-contain filter brightness-90"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Partners;
