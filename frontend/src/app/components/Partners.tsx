'use client'

import Marquee from 'react-fast-marquee'
import Image from 'next/image'

const Partners = () => {
  const partners = [
    { name: 'Barcelona', logo: '/partnersLogos/barcelona.png' },
    { name: 'Juventus', logo: '/partnersLogos/juventus.png' },
    { name: 'PSG', logo: '/partnersLogos/psg.png' },
    { name: 'Ligue 1', logo: '/partnersLogos/ligue-1.png' },
    { name: 'K-League', logo: '/partnersLogos/k-league.png' },
    { name: 'Exaion', logo: '/partnersLogos/exaion.png' }
  ]

  return (
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 py-16 px-8">
      <div className="text-center mb-12">
        <h2 className="text-white text-2xl font-light mb-4">
          A project made with{' '}
          <span className="inline-block">
            <Image 
              src="/chiliz-logo.png" 
              alt="Chiliz" 
              width={40} 
              height={40} 
              className="inline-block mx-2"
            />
          </span>
          blockchain and love
        </h2>
      </div>
      
      <Marquee 
        speed={50}
        gradient={false}
        className="opacity-90"
      >
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
  )
}

export default Partners;
