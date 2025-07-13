import { useState, useEffect } from 'react';
import { ContractService, POAP } from '../services/contractService';

export function usePoaps(walletAddress?: string) {
  const [poaps, setPoaps] = useState<POAP[]>([]);
  const [myPoaps, setMyPoaps] = useState<POAP[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractService = ContractService.getInstance();

  const fetchPoaps = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allPoaps = await contractService.getAllPoaps();
      setPoaps(allPoaps);
 
      console.log(allPoaps);
      if (walletAddress) {
        const userPoaps = contractService.filterPoapsByOwner(allPoaps, walletAddress);
        setMyPoaps(userPoaps);
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
      fetchPoaps();
    }
  }, [walletAddress]);

  return {
    poaps,
    myPoaps,
    isLoading,
    error,
    fetchPoaps,
    refetch: fetchPoaps,
  };
}