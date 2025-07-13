import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { POAP } from '../services/contractService';
import { styles } from '../styles/styles';

interface OwnedPageProps {
  onPoapPress: (poap: POAP) => void;
  myPoaps: POAP[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function OwnedPage({ 
  onPoapPress, 
  myPoaps, 
  isLoading: isLoadingPoaps, 
  error: poapsError, 
  refetch: refetchPoaps 
}: OwnedPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'recent' | 'owned_events'>('all');
  
  const filteredPoaps = myPoaps.filter(poap => {
    const matchesSearch = poap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poap.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterMode) {
      case 'recent':
        const now = Date.now() / 1000;
        const weekAgo = now - (7 * 24 * 60 * 60);
        return Number(poap.startDate) > weekAgo;
      case 'owned_events':
        // Filter to show only POAPs where the user is the owner
        return poap.owner.toLowerCase() === myPoaps.find(p => p.id === poap.id)?.owner?.toLowerCase();
      default:
        return true;
    }
  });

  const getStatsData = () => {
    const totalPoaps = myPoaps.length;
    const avgAttendance = myPoaps.length > 0 
      ? Math.round(myPoaps.reduce((sum, poap) => sum + Number(poap.currentPeopleAttending), 0) / myPoaps.length)
      : 0;
    const recentCount = myPoaps.filter(poap => {
      const now = Date.now() / 1000;
      const weekAgo = now - (7 * 24 * 60 * 60);
      return Number(poap.startDate) > weekAgo;
    }).length;
    
    return { totalPoaps, avgAttendance, recentCount };
  };

  const { totalPoaps, avgAttendance, recentCount } = getStatsData();

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
          <Text style={styles.statNumber}>{avgAttendance}</Text>
          <Text style={styles.statLabel}>Avg Attendance</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{recentCount}</Text>
          <Text style={styles.statLabel}>Recent Events</Text>
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
            style={[styles.filterChip, filterMode === 'owned_events' && styles.filterChipActive]}
            onPress={() => setFilterMode('owned_events')}
          >
            <Text style={[styles.filterChipText, filterMode === 'owned_events' && styles.filterChipTextActive]}>
              My Events
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
                  <View style={styles.attendanceBadge}>
                    <Text style={styles.attendanceText}>
                      {poap.currentPeopleAttending.toString()}/{poap.maxPeople.toString()}
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
                : 'You can create your own event using Chilli Pocket whenever you want!'
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
