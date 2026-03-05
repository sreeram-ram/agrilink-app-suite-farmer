import { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'

type UserType = 'all' | 'customer' | 'farmer' | 'driver' | 'admin'

const mockUsers = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', type: 'customer', status: 'active', joined: 'Jan 2024' },
  { id: '2', name: 'Ramesh Singh', email: 'ramesh@farm.com', type: 'farmer', status: 'active', joined: 'Jan 2024' },
  { id: '3', name: 'Amit Kumar', email: 'amit@driver.com', type: 'driver', status: 'active', joined: 'Feb 2024' },
  { id: '4', name: 'Sneha Patil', email: 'sneha@example.com', type: 'customer', status: 'active', joined: 'Mar 2024' },
  { id: '5', name: 'Vikram Farm', email: 'vikram@organic.com', type: 'farmer', status: 'pending', joined: 'Mar 2024' },
  { id: '6', name: 'Admin User', email: 'admin@agrilink.com', type: 'admin', status: 'active', joined: 'Dec 2023' },
]

const typeIcons: { [key: string]: string } = {
  customer: '👤',
  farmer: '👨‍🌾',
  driver: '🚴',
  admin: '⚙️',
}

export default function AdminUsers() {
  const [filter, setFilter] = useState<UserType>('all')
  const [search, setSearch] = useState('')

  const filteredUsers = mockUsers.filter(user => {
    const matchesType = filter === 'all' || user.type === filter
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const getStatusColor = (status: string) => {
    return status === 'active' ? colors.primary : colors.accent
  }

  const renderUser = ({ item }: { item: typeof mockUsers[0] }) => (
    <Card variant="elevated" style={styles.userCard}>
      <View style={styles.userContent}>
        <View style={styles.userIcon}>
          <Text style={styles.iconText}>{typeIcons[item.type]}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.userMeta}>
            <Text style={styles.metaText}>Joined: {item.joined}</Text>
          </View>
        </View>
        <View style={styles.userActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            {item.status === 'pending' && (
              <TouchableOpacity style={[styles.actionButton, styles.approveButton]}>
                <Text style={[styles.actionText, styles.approveText]}>Approve</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 User Management</Text>
        <Button variant="primary" size="sm">+ Add User</Button>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <Input
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Text>🔍</Text>}
        />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {(['all', 'customer', 'farmer', 'driver', 'admin'] as UserType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, filter === type && styles.filterChipActive]}
            onPress={() => setFilter(type)}
          >
            <Text style={styles.filterIcon}>{type === 'all' ? '📋' : typeIcons[type]}</Text>
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockUsers.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockUsers.filter(u => u.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockUsers.filter(u => u.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DC2626',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primaryForeground,
  },
  searchSection: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: '#DC2626',
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    ...typography.small,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: colors.text,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  userCard: {
    marginBottom: spacing.md,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  userEmail: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userMeta: {
    marginTop: spacing.xs,
  },
  metaText: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  userActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionText: {
    ...typography.small,
    color: colors.primary,
  },
  approveButton: {
    backgroundColor: colors.primaryTint,
    borderRadius: borderRadius.sm,
  },
  approveText: {
    color: colors.primary,
    fontWeight: '600',
  },
})
