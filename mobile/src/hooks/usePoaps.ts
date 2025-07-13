import { useState, useEffect } from 'react';
import { ContractService, POAP } from '../services/contractService';

export function usePoaps(walletAddress?: string) {
  const [poaps, setPoaps] = useState<POAP[]>([]);
  const [myPoaps, setMyPoaps] = useState<POAP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractService = ContractService.getInstance();

  const fetchPoaps = async (address?: string) => {
    const currentAddress = address || walletAddress;
    setIsLoading(true);
    setError(null);
    
    try {
      const allPoaps = await contractService.getAllPoaps();
      setPoaps(allPoaps);
 
      console.log('Fetched POAPs:', allPoaps);
      console.log('Current wallet address:', currentAddress);
      
      if (currentAddress) {
        const userPoaps = contractService.filterPoapsByOwner(allPoaps, currentAddress);
        console.log('User POAPs:', userPoaps);
        setMyPoaps(userPoaps);
      } else {
        setMyPoaps([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch POAPs');
      console.error('Error fetching POAPs:', err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (walletAddress) {
      fetchPoaps(walletAddress);
    }
  }, [walletAddress]);

  const refetch = async () => {
    await fetchPoaps(walletAddress);
  };

  return {
    poaps,
    myPoaps,
    isLoading,
    error,
    fetchPoaps,
    refetch,
  };
}