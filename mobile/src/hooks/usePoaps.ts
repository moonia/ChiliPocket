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
      
      if (currentAddress) {
        const userPoaps = contractService.filterPoapsByOwner(allPoaps, currentAddress);
        setMyPoaps(userPoaps);
      } else {
        setMyPoaps([]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch POAPs';
      console.error('💥 Error in fetchPoaps:', err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (walletAddress) {
      fetchPoaps(walletAddress);
    } else {
      console.log('❌ No wallet address, skipping fetch');
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