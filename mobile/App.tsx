import "@walletconnect/react-native-compat";
import { WagmiProvider } from "wagmi";
import { useAccount } from "wagmi";
import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createAppKit,
  defaultWagmiConfig,
  AppKit,
  AppKitButton,
} from "@reown/appkit-wagmi-react-native";
import { StyleSheet, View, Text, Button, TextInput, Alert, TouchableOpacity, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import * as Clipboard from 'expo-clipboard';

const queryClient = new QueryClient();

const projectId = process.env.EXPO_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const metadata = {
  name: "ChiliPocket",
  description: "ChiliPocket App",
  url: "https://reown.com/appkit",
  icons: ["https://avatars.githubusercontent.com/u/179229932"]
};

const chains = [mainnet, polygon, arbitrum] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });


createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: true,
});

function WalletComponent() {
  const { isConnected, connector } = useAccount();
  const [isModalVisible, setModalVisible] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [importedWallet, setImportedWallet] = useState<ethers.HDNodeWallet | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const handleCreateWallet = () => {
    console.log('Create new wallet');
  };

  const handleAddExistingWallet = () => {
    setModalVisible(true);
  };

  const fetchWalletBalance = async (wallet: ethers.HDNodeWallet) => {
    setIsLoadingBalance(true);
    try {
      const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
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

  const handleImportWallet = async () => {
    if (!seedPhrase.trim()) {
      Alert.alert('Error', 'Please enter a valid seed phrase');
      return;
    }

    try {
      const wallet = ethers.Wallet.fromPhrase(seedPhrase.trim());
      console.log('Wallet imported:', wallet.address);

      setImportedWallet(wallet);
      setModalVisible(false);
      setSeedPhrase('');
      
      fetchWalletBalance(wallet);
    } catch (error) {
      Alert.alert('Error', 'Invalid seed phrase. Please check and try again.');
      console.error('Wallet import error:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSeedPhrase('');
  };

  const handleDisconnect = () => {
    setImportedWallet(null);
    setWalletBalance('0');
  };

  const copyToClipboard = async () => {
    if (importedWallet) {
      await Clipboard.setStringAsync(importedWallet.address);
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>ChiliPocket</Text>
        <Text style={styles.subtitle}>Your Web3 Wallet</Text>
      </View>
      
      {importedWallet ? (
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>💼 Wallet Connected</Text>
            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
              {isLoadingBalance ? '⏳ Loading...' : `${parseFloat(walletBalance).toFixed(4)} ETH`}
            </Text>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <View style={styles.addressBox}>
              <Text style={styles.addressText}>
                {`${importedWallet.address.slice(0, 6)}...${importedWallet.address.slice(-4)}`}
              </Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyButtonText}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={() => fetchWalletBalance(importedWallet)}
          >
            <Text style={styles.refreshButtonText}>🔄 Refresh Balance</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.connectContainer}>
          <View style={styles.connectCard}>
            <Text style={styles.connectTitle}>Connect Your Wallet</Text>
            <Text style={styles.connectSubtitle}>Choose how you'd like to get started</Text>
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleCreateWallet}>
              <Text style={styles.primaryButtonText}>✨ Create New Wallet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleAddExistingWallet}>
              <Text style={styles.secondaryButtonText}>🔑 Import Existing Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <AppKit />

      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🔑 Import Wallet</Text>
          <Text style={styles.modalSubtitle}>Enter your 12 or 24-word recovery phrase</Text>
          <TextInput
            style={styles.seedInput}
            placeholder="word1 word2 word3 ..."
            placeholderTextColor="#999"
            value={seedPhrase}
            onChangeText={setSeedPhrase}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.importButton} onPress={handleImportWallet}>
              <Text style={styles.importButtonText}>Import Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletComponent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  connectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  connectSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  walletCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    margin: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disconnectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: -0.5,
  },
  addressContainer: {
    marginBottom: 24,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  addressBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#1a1a1a',
    fontWeight: '600',
    flex: 1,
  },
  copyButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 12,
  },
  copyButtonText: {
    fontSize: 16,
  },
  refreshButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  seedInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#f9fafb',
    color: '#1a1a1a',
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  importButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
