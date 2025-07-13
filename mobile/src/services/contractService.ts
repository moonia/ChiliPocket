import { CONFIG } from '../config/config';
import { ethers } from 'ethers';

export interface POAP {
  id: Number;
  name: string;
  description: string;
  imageIPFS: string;
  startDate: Number;
  endDate: Number;
  maxPeople: Number;
  currentPeopleAttending: Number;
  owner: string;
}

export class ContractService {
  private static instance: ContractService;
  private rpcUrl: string;
  private contractAddress: string;

  private constructor() {
    this.rpcUrl = CONFIG.RPC_URL || '';
    this.contractAddress = CONFIG.CONTRACT_ADDRESS || '';
  }

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  public async getAllPoaps(): Promise<POAP[]> {
    let poaps: POAP[] = [];

    try {
      const body = {
        jsonrpc: "2.0",
        method: "eth_call",
        params: [
          {
            to: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS,
            data: "0x5c90de1f",
          },
          "latest",
        ],
        id: 1,
      };

      const response = await fetch(process.env.EXPO_PUBLIC_CHILIZ_RPC_URL || "", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }) as any;
        const { result } = await response.json();
        const abi = [
          "function getPOAPs() view returns (tuple(uint256, string, string, string, uint256, uint256, uint256, uint256, address)[])",
        ];
        const iface = new ethers.Interface(abi);
        const gotPoaps = iface.decodeFunctionResult("getPOAPs", result);
        const poapArray: POAP[] = (gotPoaps[0] as any[]).map((item) => ({
          id: Number(item[0]),
          name: item[1],
          description: item[2],
          imageIPFS: item[3],
          startDate: Number(item[4]),
          endDate: Number(item[5]),
          maxPeople: Number(item[6]),
          currentPeopleAttending: Number(item[7]),
          owner: item[8],
      }));
        poaps = poapArray;
    } catch (error) {
      console.log(`POAPs not found or failed to fetch`);
    }
    return poaps;
  }

  public filterPoapsByOwner(poaps: POAP[], ownerAddress: string): POAP[] {    
    const filteredPoaps = poaps.filter(poap => {
      const isMatch = poap.owner.toLowerCase() === ownerAddress.toLowerCase();
      if (isMatch) {
        console.log('Found matching POAP:', poap.name, 'owned by:', poap.owner);
      }
      return isMatch;
    });
    return filteredPoaps;
  }
}
