import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AppKit } from '@reown/appkit-wagmi-react-native';
import Modal from 'react-native-modal';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useWallet } from '../hooks/useWallet';
import { usePoaps } from '../hooks/usePoaps';
import { styles } from '../styles/styles';

export function WalletComponent() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  
  const {
    importedWallet,
    walletBalance,
    isLoadingBalance,
    importWallet,
    disconnectWallet,
    copyAddress,
  } = useWallet();

  const {
    myPoaps,
    isLoading: isLoadingPoaps,
    error: poapsError,
    refetch: refetchPoaps,
  } = usePoaps(importedWallet?.address);

  const handleCreateWallet = () => {
    console.log('Create new wallet');
  };

  const handleAddExistingWallet = () => {
    setModalVisible(true);
  };

  const handleImportWallet = async () => {
    const success = await importWallet(seedPhrase);
    if (success) {
      setModalVisible(false);
      setSeedPhrase('');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSeedPhrase('');
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setSettingsVisible(false);
  };

  return (
    <View style={styles.container}>
      {importedWallet ? (
        <>
          <View style={styles.compactHeader}>
            <View style={styles.balanceSection}>
              <Text style={styles.compactBalanceLabel}>Total Balance</Text>
              <Text style={styles.compactBalanceAmount}>
                {isLoadingBalance ? '⏳' : `${parseFloat(walletBalance).toFixed(4)} CHZ`}
              </Text>
              <TouchableOpacity style={styles.addressContainer} onPress={copyAddress}>
                <View style={styles.addressBox}>
                  <Text style={styles.addressText}>
                    {`${importedWallet.address.slice(0, 6)}...${importedWallet.address.slice(-4)}`}
                  </Text>
                  <Feather name="copy" size={14} color="#6366f1" />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={() => setSettingsVisible(true)}
            >
              <Ionicons name="settings-outline" size={20} color="#6366f1" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.mainContent}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            
            <View style={styles.poapsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Owned POAPS</Text>
                <TouchableOpacity onPress={refetchPoaps} disabled={isLoadingPoaps}>
                  <Ionicons 
                    name="refresh"
                    size={20}
                    color={isLoadingPoaps ? "#999" : "#6366f1"}
                  />
                </TouchableOpacity>
              </View>
              
              {isLoadingPoaps ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {[1, 2, 3].map((index) => (
                    <View key={index} style={styles.skeletonCard}>
                      <View style={styles.skeletonImage} />
                      <View style={[styles.skeletonText, styles.skeletonTextLong]} />
                      <View style={[styles.skeletonText, styles.skeletonTextMedium]} />
                      <View style={[styles.skeletonText, styles.skeletonTextShort]} />
                    </View>
                  ))}
                </ScrollView>
              ) : poapsError ? (
                <Text style={styles.errorText}>Error: {poapsError}</Text>
              ) : myPoaps.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {myPoaps.map((poap) => (
                    <View key={poap.id} style={styles.poapCard}>
                      <Image 
                        source={{ uri: poap.imageIPFS }} 
                        style={styles.poapImage}
                        defaultSource={require('../../assets/icon.png')}
                      />
                      <Text style={styles.poapName}>{poap.name}</Text>
                      <Text style={styles.poapDescription} numberOfLines={2}>
                        {poap.description}
                      </Text>
                      <Text style={styles.poapDurability}>
                        Durability: {poap.durability}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noPoapText}>No POAPs found</Text>
              )}
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.connectContainer}>
          <View style={styles.connectCard}>
            <Text style={styles.connectTitle}>Connect Your Wallet</Text>
            <Text style={styles.connectSubtitle}>Choose how you'd like to get started</Text>
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleCreateWallet}>
              <MaterialIcons name="add-circle-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Create New Wallet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleAddExistingWallet}>
              <MaterialIcons name="vpn-key" size={20} color="#6366f1" style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <AppKit />

      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <MaterialIcons name="vpn-key" size={24} color="#6366f1" />
            <Text style={styles.modalTitle}>Import Wallet</Text>
          </View>
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
              <MaterialIcons name="close" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.importButton} onPress={handleImportWallet}>
              <Text style={styles.importButtonText}>Import Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={isSettingsVisible} onBackdropPress={closeSettings}>
        <View style={styles.settingsModal}>
          <Text style={styles.settingsTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
            <MaterialIcons name="logout" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.disconnectText}>Disconnect Wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={closeSettings}>
            <MaterialIcons name="close" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}