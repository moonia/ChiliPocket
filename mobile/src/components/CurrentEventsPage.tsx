import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { POAP } from '../services/contractService';
import { styles } from '../styles/styles';

interface CurrentEventsPageProps {
  onPoapPress: (poap: POAP) => void;
  allPoaps: POAP[];
  myPoaps: POAP[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  userAddress?: string;
}

export function CurrentEventsPage({ 
  onPoapPress, 
  allPoaps, 
  myPoaps, 
  isLoading: isLoadingPoaps, 
  error: poapsError, 
  refetch: refetchPoaps,
  userAddress 
}: CurrentEventsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'new' | 'ending_soon' | 'popular'>('all');

  const myPoapIds = new Set(myPoaps.map(poap => poap.id.toString()));

  const availableEvents = allPoaps.filter(poap => !myPoapIds.has(poap.id.toString()));
  
  const filteredEvents = availableEvents.filter(poap => {
    const matchesSearch = poap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poap.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterMode) {
      case 'new':
        const now = Date.now() / 1000; // Convert to seconds
        const dayAgo = now - (24 * 60 * 60); // 24 hours ago
        return Number(poap.startDate) > dayAgo;
      case 'ending_soon':
        const nowEndingSoon = Date.now() / 1000;
        const nextWeek = nowEndingSoon + (7 * 24 * 60 * 60); // Next 7 days
        return Number(poap.endDate) < nextWeek && Number(poap.endDate) > nowEndingSoon;
      case 'popular':
        const attendanceRate = Number(poap.currentPeopleAttending) / Number(poap.maxPeople);
        return attendanceRate > 0.5; // More than 50% attendance
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
            Alert.alert('Success', 'You are now participating in this event!');
          },
        },
      ]
    );
  };

  const getEventStatus = (poap: POAP) => {
    const now = Date.now() / 1000;
    const startDate = Number(poap.startDate);
    const endDate = Number(poap.endDate);
    const attendanceRate = Number(poap.currentPeopleAttending) / Number(poap.maxPeople);
    
    if (endDate < now) return { label: 'Ended', color: '#6b7280' };
    if (startDate > now) return { label: 'Upcoming', color: '#3b82f6' };
    if (attendanceRate > 0.8) return { label: 'Almost Full', color: '#ef4444' };
    if (attendanceRate > 0.5) return { label: 'Popular', color: '#f59e0b' };
    return { label: 'Available', color: '#10b981' };
  };

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
            style={[styles.filterChip, filterMode === 'popular' && styles.filterChipActive]}
            onPress={() => setFilterMode('popular')}
          >
            <Text style={[styles.filterChipText, filterMode === 'popular' && styles.filterChipTextActive]}>
              Popular
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
              const isOwner = userAddress && poap.owner.toLowerCase() === userAddress.toLowerCase();
              return (
                <TouchableOpacity 
                  key={poap.id.toString()} 
                  style={[styles.eventCard, isOwner && styles.ownedEventCard]}
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
                      <View style={styles.statusContainer}>
                        {isOwner && (
                          <View style={styles.ownerBadge}>
                            <Ionicons name="crown" size={12} color="#f59e0b" />
                            <Text style={styles.ownerBadgeText}>Owner</Text>
                          </View>
                        )}
                        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                          <Text style={styles.statusText}>{status.label}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.eventDescription} numberOfLines={3}>
                      {poap.description}
                    </Text>
                    <View style={styles.eventFooter}>
                      <View style={styles.eventStats}>
                        <View style={styles.eventStat}>
                          <Ionicons name="people-outline" size={16} color="#6366f1" />
                          <Text style={styles.eventStatText}>
                            {poap.currentPeopleAttending.toString()}/{poap.maxPeople.toString()} attending
                          </Text>
                        </View>
                        <View style={styles.eventStat}>
                          <Ionicons name="time-outline" size={16} color="#6366f1" />
                          <Text style={styles.eventStatText}>
                            Ends: {new Date(Number(poap.endDate) * 1000).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      {isOwner ? (
                        <View style={styles.ownerStatsContainer}>
                          <Text style={styles.ownerStatsText}>
                            {Math.round((Number(poap.currentPeopleAttending) / Number(poap.maxPeople)) * 100)}% full
                          </Text>
                        </View>
                      ) : (
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
                      )}
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