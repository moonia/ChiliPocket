import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, Linking } from 'react-native';
import { AppKit } from '@reown/appkit-wagmi-react-native';
import Modal from 'react-native-modal';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import { useWallet } from '../hooks/useWallet';
import { usePoaps } from '../hooks/usePoaps';
import { POAP } from '../services/contractService';
import { styles } from '../styles/styles';
import { OwnedPage } from './OwnedPage';
import { CurrentEventsPage } from './CurrentEventsPage';

export function WalletComponent() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isPoapDetailsVisible, setPoapDetailsVisible] = useState(false);
  const [selectedPoap, setSelectedPoap] = useState<POAP | null>(null);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'owned' | 'events'>('home');
  
  const {
    importedWallet,
    walletBalance,
    isLoadingBalance,
    importWallet,
    disconnectWallet,
    copyAddress,
  } = useWallet();

  const {
    poaps: allPoaps,
    myPoaps,
    isLoading: isLoadingPoaps,
    error: poapsError,
    refetch: refetchPoaps,
  } = usePoaps(importedWallet?.address);

  console.log('🎯 WalletComponent - importedWallet:', importedWallet);
  console.log('🎯 WalletComponent - wallet address:', importedWallet?.address);
  console.log('🎯 WalletComponent - myPoaps count:', myPoaps?.length);
  console.log('🎯 WalletComponent - allPoaps count:', allPoaps?.length);

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

  const handlePoapPress = (poap: POAP) => {
    console.log('Selected POAP:', poap);
    setSelectedPoap(poap);
    setPoapDetailsVisible(true);
  };

  const handlePageChange = async (page: 'home' | 'owned' | 'events') => {
    console.log('Switching to page:', page);
    console.log('Current wallet address:', importedWallet?.address);
    console.log('Current myPoaps count:', myPoaps.length);
    console.log('Current allPoaps count:', allPoaps.length);
    
    setCurrentPage(page);
    
    // Always refresh data when switching to ensure fresh data
    if (importedWallet?.address) {
      console.log('Triggering refetch for page:', page);
      await refetchPoaps();
    }
  };

  const copyOwnerAddress = async (ownerAddress: string) => {
    try {
      await Clipboard.setStringAsync(ownerAddress);
      Alert.alert('Copied!', 'Owner address copied to clipboard');
    } catch (error) {
      console.error('Failed to copy address:', error);
      Alert.alert('Error', 'Failed to copy address');
    }
  };

  const closePoapDetails = () => {
    setPoapDetailsVisible(false);
    setSelectedPoap(null);
  };

  const handleNFCScan = async () => {
    try {
      setIsScanning(true);
      
      const isAvailable = await NFC.hasHardwareAsync();
      if (!isAvailable) {
        Alert.alert('NFC Not Available', 'This device does not support NFC functionality.');
        setIsScanning(false);
        return;
      }

      const isEnabled = await NFC.isEnabledAsync();
      if (!isEnabled) {
        Alert.alert('NFC Not Enabled', 'Please enable NFC in your device settings and try again.');
        setIsScanning(false);
        return;
      }

      Alert.alert(
        'NFC Scan Ready',
        'Hold your device near an NFC tag to scan.',
        [
          {
            text: 'Cancel',
            onPress: () => setIsScanning(false),
            style: 'cancel',
          },
        ]
      );

      const message = await NFC.requestAsync({
        alertMessage: 'Hold your device near the NFC tag',
      });

      if (message && message.ndefMessage) {
        const record = message.ndefMessage[0];
        if (record && record.payload) {
          const payload = String.fromCharCode.apply(null, new Uint8Array(record.payload));
          
          let url = payload;
          if (payload.startsWith('\u0003')) {
            url = payload.substring(1);
          }
          if (payload.includes('http')) {
            const httpIndex = payload.indexOf('http');
            url = payload.substring(httpIndex);
          }

          if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            Alert.alert(
              'NFC Tag Scanned',
              `Found URL: ${url}`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open Link',
                  onPress: () => Linking.openURL(url),
                },
              ]
            );
          } else {
            Alert.alert('NFC Tag Scanned', `Content: ${payload}`);
          }
        } else {
          Alert.alert('Scan Complete', 'No readable content found on the NFC tag.');
        }
      }
    } catch (error) {
      console.error('NFC scan error:', error);
      Alert.alert('Scan Error', 'Failed to scan NFC tag. Please try again.');
    } finally {
      setIsScanning(false);
    }
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
          
          {/* Navigation Tabs */}
          <View style={styles.navigationTabs}>
            <TouchableOpacity 
              style={[styles.navTab, currentPage === 'home' && styles.navTabActive]}
              onPress={() => handlePageChange('home')}
            >
              <Ionicons 
                name="home" 
                size={20} 
                color={currentPage === 'home' ? '#6366f1' : '#999'} 
              />
              <Text style={[styles.navTabText, currentPage === 'home' && styles.navTabTextActive]}>
                Home
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navTab, currentPage === 'owned' && styles.navTabActive]}
              onPress={() => handlePageChange('owned')}
            >
              <Ionicons 
                name="trophy" 
                size={20} 
                color={currentPage === 'owned' ? '#6366f1' : '#999'} 
              />
              <Text style={[styles.navTabText, currentPage === 'owned' && styles.navTabTextActive]}>
                Owned
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navTab, currentPage === 'events' && styles.navTabActive]}
              onPress={() => handlePageChange('events')}
            >
              <Ionicons 
                name="calendar" 
                size={20} 
                color={currentPage === 'events' ? '#6366f1' : '#999'} 
              />
              <Text style={[styles.navTabText, currentPage === 'events' && styles.navTabTextActive]}>
                Events
              </Text>
            </TouchableOpacity>
          </View>

          {/* Page Content */}
          {currentPage === 'home' && (
            <ScrollView style={styles.mainContent}>            
              <View style={styles.poapsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Owned Events</Text>
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
                    {myPoaps.slice(0, 5).map((poap) => (
                      <TouchableOpacity 
                        key={poap.id.toString()} 
                        style={styles.poapCard}
                        onPress={() => handlePoapPress(poap)}
                        activeOpacity={0.8}
                      >
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
                          Durability: {poap.durability.toString()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {myPoaps.length > 5 && (
                      <TouchableOpacity 
                        style={styles.seeMoreCard}
                        onPress={() => handlePageChange('owned')}
                      >
                        <Ionicons name="arrow-forward" size={24} color="#6366f1" />
                        <Text style={styles.seeMoreText}>See All</Text>
                        <Text style={styles.seeMoreCount}>+{myPoaps.length - 5}</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                ) : (
                  <Text style={styles.noPoapText}>No events found</Text>
                )}
              </View>

              <View style={styles.poapsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Current Events</Text>
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
                      <View key={`participating-${index}`} style={styles.skeletonCard}>
                        <View style={styles.skeletonImage} />
                        <View style={[styles.skeletonText, styles.skeletonTextLong]} />
                        <View style={[styles.skeletonText, styles.skeletonTextMedium]} />
                        <View style={[styles.skeletonText, styles.skeletonTextShort]} />
                      </View>
                    ))}
                  </ScrollView>
                ) : poapsError ? (
                  <Text style={styles.errorText}>Error: {poapsError}</Text>
                ) : allPoaps.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {allPoaps.slice(0, 5).map((poap) => (
                      <TouchableOpacity 
                        key={`all-${poap.id}`} 
                        style={styles.poapCard}
                        onPress={() => handlePoapPress(poap)}
                        activeOpacity={0.8}
                      >
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
                          Durability: {poap.durability.toString()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {allPoaps.length > 5 && (
                      <TouchableOpacity 
                        style={styles.seeMoreCard}
                        onPress={() => handlePageChange('events')}
                      >
                        <Ionicons name="arrow-forward" size={24} color="#6366f1" />
                        <Text style={styles.seeMoreText}>See All</Text>
                        <Text style={styles.seeMoreCount}>+{allPoaps.length - 5}</Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                ) : (
                  <Text style={styles.noPoapText}>No events available</Text>
                )}
              </View>
            </ScrollView>
          )}

          {currentPage === 'owned' && (
            <OwnedPage 
              onPoapPress={handlePoapPress}
              myPoaps={myPoaps}
              isLoading={isLoadingPoaps}
              error={poapsError}
              refetch={refetchPoaps}
            />
          )}

          {currentPage === 'events' && (
            <CurrentEventsPage 
              onPoapPress={handlePoapPress}
              allPoaps={allPoaps}
              myPoaps={myPoaps}
              isLoading={isLoadingPoaps}
              error={poapsError}
              refetch={refetchPoaps}
            />
          )}
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

      <Modal isVisible={isPoapDetailsVisible} onBackdropPress={closePoapDetails}>
        <View style={styles.poapDetailsModal}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={closePoapDetails}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          {selectedPoap ? (
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}>
              <View style={styles.poapDetailsHeader}>
                <Image 
                  source={{ uri: selectedPoap.imageIPFS }} 
                  style={styles.poapDetailsImage}
                  defaultSource={require('../../assets/icon.png')}
                />
                <Text style={styles.poapDetailsName}>{selectedPoap.name}</Text>
              </View>
              
              <View style={styles.poapDetailsContent}>
                <View style={styles.poapDetailsSection}>
                  <Text style={styles.poapDetailsSectionTitle}>Description</Text>
                  <Text style={styles.poapDetailsDescription}>{selectedPoap.description || 'No description available'}</Text>
                </View>
                
                <View style={styles.poapDetailsSection}>
                  <Text style={styles.poapDetailsSectionTitle}>Details</Text>
                  <View style={styles.poapDetailsRow}>
                    <Text style={styles.poapDetailsLabel}>Token ID:</Text>
                    <Text style={styles.poapDetailsValue}>#{selectedPoap.id.toString()}</Text>
                  </View>
                  <View style={styles.poapDetailsRow}>
                    <Text style={styles.poapDetailsLabel}>Durability:</Text>
                    <Text style={styles.poapDetailsValue}>{selectedPoap.durability.toString()}</Text>
                  </View>
                  <View style={styles.poapDetailsRow}>
                    <Text style={styles.poapDetailsLabel}>Owner:</Text>
                    <View style={styles.ownerContainer}>
                      <Text style={styles.poapDetailsValue}>
                        {selectedPoap.owner ? `${selectedPoap.owner.slice(0, 6)}...${selectedPoap.owner.slice(-4)}` : 'Unknown'}
                      </Text>
                      {selectedPoap.owner && (
                        <TouchableOpacity 
                          onPress={() => {
                            console.log('Copy button pressed for owner:', selectedPoap.owner);
                            console.log('Current user address:', importedWallet?.address);
                            console.log('Is same owner?', selectedPoap.owner.toLowerCase() === importedWallet?.address.toLowerCase());
                            copyOwnerAddress(selectedPoap.owner);
                          }}
                          style={styles.copyOwnerButton}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Feather name="copy" size={16} color="#6366f1" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading...</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}