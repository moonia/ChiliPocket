import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { usePoaps } from '../hooks/usePoaps';
import { useWallet } from '../hooks/useWallet';
import { POAP } from '../services/contractService';
import { styles } from '../styles/styles';

interface CurrentEventsPageProps {
  onPoapPress: (poap: POAP) => void;
}

export function CurrentEventsPage({ onPoapPress }: CurrentEventsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'new' | 'ending_soon' | 'high_durability'>('all');
  
  const { importedWallet } = useWallet();
  const {
    poaps: allPoaps,
    myPoaps,
    isLoading: isLoadingPoaps,
    error: poapsError,
    refetch: refetchPoaps,
  } = usePoaps(importedWallet?.address);

  const myPoapIds = new Set(myPoaps.map(poap => poap.id.toString()));
  
  const availableEvents = allPoaps.filter(poap => !myPoapIds.has(poap.id.toString()));

  const filteredEvents = availableEvents.filter(poap => {
    const matchesSearch = poap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poap.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterMode) {
      case 'new':
        return true; // Could implement date-based filtering if timestamps are available
      case 'ending_soon':
        return true; // Could implement end date filtering if available
      case 'high_durability':
        return Number(poap.durability) > 50;
      default:
        return true;
    }
  });

  const handleParticipate = (poap: POAP) => {
    Alert.alert(
      'Participate in Event',
      `Would you like to participate in "${poap.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Participate',
          onPress: () => {
            // This would integrate with your contract service to participate
            console.log('Participating in POAP:', poap.id);
            Alert.alert('Success', 'You are now participating in this event!');
          },
        },
      ]
    );
  };

  const getEventStatus = (poap: POAP) => {
    const durability = Number(poap.durability);
    if (durability > 80) return { label: 'Premium', color: '#10b981' };
    if (durability > 50) return { label: 'High Quality', color: '#3b82f6' };
    if (durability > 20) return { label: 'Standard', color: '#f59e0b' };
    return { label: 'Limited', color: '#ef4444' };
  };

  // This component receives fresh data through props via the parent's handlePageChange

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Current Events</Text>
        <TouchableOpacity onPress={refetchPoaps} disabled={isLoadingPoaps}>
          <Ionicons 
            name="refresh"
            size={24}
            color={isLoadingPoaps ? "#999" : "#6366f1"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.eventsStatsContainer}>
        <View style={styles.eventStatCard}>
          <Ionicons name="calendar-outline" size={24} color="#6366f1" />
          <Text style={styles.eventStatNumber}>{availableEvents.length}</Text>
          <Text style={styles.eventStatLabel}>Available Events</Text>
        </View>
        <View style={styles.eventStatCard}>
          <Ionicons name="trophy-outline" size={24} color="#10b981" />
          <Text style={styles.eventStatNumber}>{myPoaps.length}</Text>
          <Text style={styles.eventStatLabel}>Already Owned</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
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
              All Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterMode === 'new' && styles.filterChipActive]}
            onPress={() => setFilterMode('new')}
          >
            <Text style={[styles.filterChipText, filterMode === 'new' && styles.filterChipTextActive]}>
              New
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterMode === 'ending_soon' && styles.filterChipActive]}
            onPress={() => setFilterMode('ending_soon')}
          >
            <Text style={[styles.filterChipText, filterMode === 'ending_soon' && styles.filterChipTextActive]}>
              Ending Soon
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterMode === 'high_durability' && styles.filterChipActive]}
            onPress={() => setFilterMode('high_durability')}
          >
            <Text style={[styles.filterChipText, filterMode === 'high_durability' && styles.filterChipTextActive]}>
              Premium
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.eventsGrid} showsVerticalScrollIndicator={false}>
        {isLoadingPoaps ? (
          <View style={styles.eventsContainer}>
            {[1, 2, 3, 4].map((index) => (
              <View key={index} style={styles.eventSkeletonCard}>
                <View style={styles.skeletonImage} />
                <View style={styles.eventSkeletonContent}>
                  <View style={[styles.skeletonText, styles.skeletonTextLong]} />
                  <View style={[styles.skeletonText, styles.skeletonTextMedium]} />
                  <View style={[styles.skeletonText, styles.skeletonTextShort]} />
                </View>
              </View>
            ))}
          </View>
        ) : poapsError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>Error loading events</Text>
            <Text style={styles.errorSubText}>{poapsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetchPoaps}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredEvents.length > 0 ? (
          <View style={styles.eventsContainer}>
            {filteredEvents.map((poap) => {
              const status = getEventStatus(poap);
              return (
                <TouchableOpacity 
                  key={poap.id.toString()} 
                  style={styles.eventCard}
                  onPress={() => onPoapPress(poap)}
                  activeOpacity={0.8}
                >
                  <Image 
                    source={{ uri: poap.imageIPFS }} 
                    style={styles.eventImage}
                    defaultSource={require('../../assets/icon.png')}
                  />
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventName} numberOfLines={2}>{poap.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                        <Text style={styles.statusText}>{status.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.eventDescription} numberOfLines={3}>
                      {poap.description}
                    </Text>
                    <View style={styles.eventFooter}>
                      <View style={styles.eventStats}>
                        <View style={styles.eventStat}>
                          <Ionicons name="shield-outline" size={16} color="#6366f1" />
                          <Text style={styles.eventStatText}>
                            Durability: {poap.durability.toString()}
                          </Text>
                        </View>
                        <View style={styles.eventStat}>
                          <Ionicons name="finger-print-outline" size={16} color="#6366f1" />
                          <Text style={styles.eventStatText}>
                            ID: #{poap.id.toString()}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.participateButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleParticipate(poap);
                        }}
                      >
                        <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
                        <Text style={styles.participateButtonText}>Join</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No matching events' : 'No events available'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Check back later for new events to participate in!'
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