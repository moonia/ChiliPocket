import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { usePoaps } from '../hooks/usePoaps';
import { useWallet } from '../hooks/useWallet';
import { POAP } from '../services/contractService';
import { styles } from '../styles/styles';

interface OwnedPageProps {
  onPoapPress: (poap: POAP) => void;
}

export function OwnedPage({ onPoapPress }: OwnedPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'recent' | 'high_durability'>('all');
  
  const { importedWallet } = useWallet();
  const {
    myPoaps,
    isLoading: isLoadingPoaps,
    error: poapsError,
    refetch: refetchPoaps,
  } = usePoaps(importedWallet?.address);

  const filteredPoaps = myPoaps.filter(poap => {
    const matchesSearch = poap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poap.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterMode) {
      case 'recent':
        return true; // Could implement date-based filtering if timestamps are available
      case 'high_durability':
        return Number(poap.durability) > 50;
      default:
        return true;
    }
  });

  const getStatsData = () => {
    const totalPoaps = myPoaps.length;
    const avgDurability = myPoaps.length > 0 
      ? Math.round(myPoaps.reduce((sum, poap) => sum + Number(poap.durability), 0) / myPoaps.length)
      : 0;
    const highDurabilityCount = myPoaps.filter(poap => Number(poap.durability) > 50).length;
    
    return { totalPoaps, avgDurability, highDurabilityCount };
  };

  const { totalPoaps, avgDurability, highDurabilityCount } = getStatsData();

  // This component receives fresh data through props via the parent's handlePageChange

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My POAPs</Text>
        <TouchableOpacity onPress={refetchPoaps} disabled={isLoadingPoaps}>
          <Ionicons 
            name="refresh"
            size={24}
            color={isLoadingPoaps ? "#999" : "#6366f1"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalPoaps}</Text>
          <Text style={styles.statLabel}>Total POAPs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{avgDurability}</Text>
          <Text style={styles.statLabel}>Avg Durability</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{highDurabilityCount}</Text>
          <Text style={styles.statLabel}>High Quality</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your POAPs..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterChip, filterMode === 'all' && styles.filterChipActive]}
            onPress={() => setFilterMode('all')}
          >
            <Text style={[styles.filterChipText, filterMode === 'all' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterMode === 'recent' && styles.filterChipActive]}
            onPress={() => setFilterMode('recent')}
          >
            <Text style={[styles.filterChipText, filterMode === 'recent' && styles.filterChipTextActive]}>
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterMode === 'high_durability' && styles.filterChipActive]}
            onPress={() => setFilterMode('high_durability')}
          >
            <Text style={[styles.filterChipText, filterMode === 'high_durability' && styles.filterChipTextActive]}>
              High Quality
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.poapGrid} showsVerticalScrollIndicator={false}>
        {isLoadingPoaps ? (
          <View style={styles.gridContainer}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <View key={index} style={styles.gridSkeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={[styles.skeletonText, styles.skeletonTextLong]} />
                <View style={[styles.skeletonText, styles.skeletonTextShort]} />
              </View>
            ))}
          </View>
        ) : poapsError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>Error loading POAPs</Text>
            <Text style={styles.errorSubText}>{poapsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetchPoaps}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredPoaps.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredPoaps.map((poap) => (
              <TouchableOpacity 
                key={poap.id.toString()} 
                style={styles.gridPoapCard}
                onPress={() => onPoapPress(poap)}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: poap.imageIPFS }} 
                  style={styles.gridPoapImage}
                  defaultSource={require('../../assets/icon.png')}
                />
                <Text style={styles.gridPoapName} numberOfLines={2}>{poap.name}</Text>
                <View style={styles.gridPoapFooter}>
                  <View style={styles.durabilityBadge}>
                    <Text style={styles.durabilityText}>
                      {poap.durability.toString()}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="medal-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No matching POAPs' : 'No POAPs owned'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Start participating in events to earn your first POAP!'
              }
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                style={styles.clearSearchButton} 
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}