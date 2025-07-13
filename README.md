# 🌶️ Chiliz Hackathon - ChiliPocket

> _Revolutionizing Fan Engagement Through Blockchain & NFC Technology_

## 🎯 Vision & Core Concept
#### The Fan Experience Revolution
ChiliPocket enables fans to collect POAPs (Proof of Attendance Protocol NFTs) when attending live sports events across the globe.

Using NFC technology embedded at stadium gates or event zones, fans can tap their phone or ticket to mint a unique NFT badge directly to their wallet on the Chiliz Chain (a verifiable, non-transferable proof that "I was there").

These collectible memories become part of a fan's on-chain identity, allowing for:

- A personal global fan passport

- Access to exclusive content, raffles, or merchandise

- Loyalty rewards for superfans who attend multiple events or visit iconic venues

- Gamification with leaderboards and achievements

## ⚽ Why It Matters

This project ties directly into the core values of Chiliz:

- Fan Ownership: POAPs are minted to individual wallets and cannot be faked or transferred.

- Engagement: Fans are rewarded not just for spending, but for showing up.


## 🚀 Getting started
To run the project locally, simply clone the repository and follow these steps.

### 🛠 Requirements
- Node.js >= 18

- Metamask Wallet (Chiliz Testnet)

- NFC-enabled device

### Contracts 
#### Dependencies

Before writing or deploying your contracts, make sure to install the following libraries:

```
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-foundry-upgrades
forge install OpenZeppelin/openzeppelin-contracts-upgradeable
```

Smart contracts can be deployed using Foundry.

### Frontend

Duplicate the .env.example file into .env and fill the required variables based on your environment.

Then you just need to install the dependencies and start the project:

```
npm install
npm run dev
````

### Image Hosting – IPFS & Pinata

All product or user images used in the application are stored on IPFS (InterPlanetary File System) to ensure decentralized, tamper-resistant storage.
We use Pinata as our IPFS pinning service to upload, manage, and persist these files across the network.

When a new image is uploaded, it's pinned to IPFS via Pinata and the resulting CID (Content Identifier) is stored and referenced by the application.

## 📣 Future Ideas

- Leaderboards for "most-traveled" fans

- Social sharing features to show off POAPs

- Partnership program with clubs to whitelist event POAPs

## ❤️ Our Team 

Developers
| [<img src="https://github.com/Molaryy.png?size=85" width=85><br><sub>Mohammed</sub>](https://github.com/Molaryy) | [<img src="https://github.com/RahulCHANDER25.png?size=85" width=85><br><sub>Rahul</sub>](https://github.com/RahulCHANDER25) | [<img src="https://github.com/moonia.png?size=85" width=85><br><sub>Mounia</sub>](https://github.com/moonia)
| :---: | :---: | :---: |

> Don't hesitate to put a star 🌟