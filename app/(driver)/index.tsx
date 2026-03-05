import { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { Container, Card, Button } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

interface Delivery {
  id: string
  orderNumber: string
  customerName: string
  address: string
  amount: number
  distance: string
  status: 'pending' | 'picked' | 'delivered'
}

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    orderNumber: 'ORD12345',
    customerName: 'Priya Sharma',
    address: '123, Palm Beach Road, Navi Mumbai',
    amount: 450,
    distance: '2.5 km',
    status: 'pending',
  },
  {
    id: '2',
    orderNumber: 'ORD12344',
    customerName: 'Amit Kumar',
    address: '456, Sector 15, CBD Belapur',
    amount: 890,
    distance: '3.2 km',
    status: 'pending',
  },
  {
    id: '3',
    orderNumber: 'ORD12343',
    customerName: 'Sneha Patil',
    address: '789, Vashi Market, Vashi',
    amount: 320,
    distance: '4.1 km',
    status: 'picked',
  },
]

export default function DriverDeliveries() {
  const [deliveries, setDeliveries] = useState(mockDeliveries)

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending')
  const activeDeliveries = deliveries.filter(d => d.status === 'picked')

  const updateStatus = (id: string, newStatus: 'picked' | 'delivered') => {
    Alert.alert(
      'Update Status',
      newStatus === 'picked' ? 'Confirm pickup from farmer?' : 'Confirm delivery to customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm',
          onPress: () => {
            setDeliveries(prev => prev.map(d => 
              d.id === id ? { ...d, status: newStatus } : d
            ))
          }
        },
      ]
    )
  }

  const renderDelivery = ({ item }: { item: Delivery }) => (
    <Card variant="elevated" style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.customerName}>👤 {item.customerName}</Text>
        </View>
        <View style={styles.amountBadge}>
          <Text style={styles.amountText}>₹{item.amount}</Text>
        </View>
      </View>

      <View style={styles.deliveryDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📏</Text>
          <Text style={styles.detailText}>{item.distance}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.deliveryActions}>
          <Button variant="primary" size="sm" onPress={() => updateStatus(item.id, 'picked')}>
            Pick Up 📦
          </Button>
          <Button variant="outline" size="sm" onPress={() => {}}>
            Navigate 🗺️
          </Button>
        </View>
      )}

      {item.status === 'picked' && (
        <View style={styles.deliveryActions}>
          <Button variant="primary" size="sm" onPress={() => updateStatus(item.id, 'delivered')}>
            Deliver ✓
          </Button>
          <Button variant="outline" size="sm" onPress={() => {}}>
            Call 📞
          </Button>
        </View>
      )}

      {item.status === 'delivered' && (
        <View style={styles.deliveredBadge}>
          <Text style={styles.deliveredText}>✓ Delivered</Text>
        </View>
      )}
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚴 Deliveries</Text>
        <Text style={styles.headerSubtitle}>Accept and complete deliveries</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <Card variant="elevated" style={[styles.statCard, styles.statPending]}>
          <Text style={styles.statIcon}>⏳</Text>
          <Text style={styles.statValue}>{pendingDeliveries.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card variant="elevated" style={[styles.statCard, styles.statActive]}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statValue}>{activeDeliveries.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card variant="elevated" style={[styles.statCard, styles.statCompleted]}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Today</Text>
        </Card>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>New ({pendingDeliveries.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Active ({activeDeliveries.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderDelivery}
        contentContainerStyle={styles.list}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primaryForeground,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statPending: {
    backgroundColor: colors.accentTint,
  },
  statActive: {
    backgroundColor: colors.primaryTint,
  },
  statCompleted: {
    backgroundColor: colors.secondaryTint,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: '#7C3AED',
  },
  tabText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  deliveryCard: {
    marginBottom: spacing.md,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.h4,
    color: colors.text,
  },
  customerName: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  amountBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  amountText: {
    ...typography.h4,
    color: colors.primary,
  },
  deliveryDetails: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  detailText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  deliveryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  deliveredBadge: {
    backgroundColor: colors.secondaryTint,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  deliveredText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
  },
})
