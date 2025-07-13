import { useState } from 'react';
import { ethers } from 'ethers';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export const useWallet = () => {
  const [importedWallet, setImportedWallet] = useState<ethers.HDNodeWallet | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const fetchWalletBalance = async (wallet: ethers.HDNodeWallet) => {
    setIsLoadingBalance(true);
    try {
      const provider = new ethers.JsonRpcProvider(process.env.EXPO_PUBLIC_CHILIZ_RPC_URL);
      const connectedWallet = wallet.connect(provider);
      const balance = await provider.getBalance(wallet.address);
      const balanceInEth = ethers.formatEther(balance);
      setWalletBalance(balanceInEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setWalletBalance('Error loading balance');
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const importWallet = async (seedPhrase: string) => {
    if (!seedPhrase.trim()) {
      Alert.alert('Error', 'Please enter a valid seed phrase');
      return false;
    }

    try {
      const wallet = ethers.Wallet.fromPhrase(seedPhrase.trim());
      console.log('Wallet imported:', wallet.address);

      setImportedWallet(wallet);
      await fetchWalletBalance(wallet);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Invalid seed phrase. Please check and try again.');
      console.error('Wallet import error:', error);
      return false;
    }
  };

  const disconnectWallet = () => {
    setImportedWallet(null);
    setWalletBalance('0');
  };

  const copyAddress = async () => {
    if (importedWallet) {
      await Clipboard.setStringAsync(importedWallet.address);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  const refreshBalance = () => {
    if (importedWallet) {
      fetchWalletBalance(importedWallet);
    }
  };

  return {
    importedWallet,
    walletBalance,
    isLoadingBalance,
    importWallet,
    disconnectWallet,
    copyAddress,
    refreshBalance,
  };
};