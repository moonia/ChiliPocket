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
    console.log('🔄 usePoaps.fetchPoaps called with address:', currentAddress);
    console.log('🔄 walletAddress from hook:', walletAddress);
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 Calling contractService.getAllPoaps()...');
      const allPoaps = await contractService.getAllPoaps();
      console.log('✅ getAllPoaps returned:', allPoaps?.length, 'POAPs');
      console.log('📊 Full allPoaps data:', allPoaps);
      
      setPoaps(allPoaps);
      
      if (currentAddress) {
        console.log('🔍 Filtering POAPs for address:', currentAddress);
        const userPoaps = contractService.filterPoapsByOwner(allPoaps, currentAddress);
        console.log('🏆 Filtered user POAPs:', userPoaps?.length, 'POAPs');
        console.log('📊 Full userPoaps data:', userPoaps);
        setMyPoaps(userPoaps);
      } else {
        console.log('❌ No address provided, setting empty myPoaps');
        setMyPoaps([]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch POAPs';
      console.error('💥 Error in fetchPoaps:', err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
      console.log('✅ fetchPoaps completed, isLoading set to false');
    }
  };


  useEffect(() => {
    console.log('🔄 usePoaps useEffect triggered with walletAddress:', walletAddress);
    if (walletAddress) {
      console.log('✅ Wallet address exists, fetching POAPs...');
      fetchPoaps(walletAddress);
    } else {
      console.log('❌ No wallet address, skipping fetch');
    }
  }, [walletAddress]);

  const refetch = async () => {
    console.log('🔄 usePoaps.refetch called with walletAddress:', walletAddress);
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