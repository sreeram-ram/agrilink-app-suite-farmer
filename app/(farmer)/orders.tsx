import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { Container, Card, Button } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { blink } from '@/lib/blink'

const statusColors: { [key: string]: string } = {
  pending: colors.accent,
  confirmed: colors.primary,
  packed: colors.secondary,
  shipped: colors.primaryLight,
  delivered: colors.primary,
  cancelled: colors.error,
}

export default function FarmerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [filter])

  const loadOrders = async () => {
    try {
      let query: any = { orderBy: { orderedAt: 'desc' }, limit: 50 }
      if (filter !== 'all') {
        query.where = { status: filter }
      }
      const data = await blink.db.orders.list(query)
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    Alert.alert(
      'Update Order',
      `Mark order as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: async () => {
            await blink.db.orders.update(orderId, { status: newStatus })
            loadOrders()
          }
        },
      ]
    )
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderOrder = ({ item }: { item: any }) => (
    <Card variant="elevated" style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderedAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || colors.secondary }]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Items:</Text>
          <Text style={styles.detailValue}>Multiple items</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.detailValue}>₹{item.total}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Delivery:</Text>
          <Text style={styles.detailValue} numberOfLines={1}>{item.deliveryAddress}</Text>
        </View>
        {item.deliveryNotes && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Note:</Text>
            <Text style={styles.detailValue}>{item.deliveryNotes}</Text>
          </View>
        )}
      </View>

      <View style={styles.orderActions}>
        {item.status === 'pending' && (
          <>
            <Button variant="primary" size="sm" onPress={() => updateOrderStatus(item.id, 'confirmed')}>
              Accept
            </Button>
            <Button variant="danger" size="sm" onPress={() => updateOrderStatus(item.id, 'cancelled')}>
              Decline
            </Button>
          </>
        )}
        {item.status === 'confirmed' && (
          <Button variant="primary" size="sm" onPress={() => updateOrderStatus(item.id, 'packed')}>
            Mark as Packed
          </Button>
        )}
        {item.status === 'packed' && (
          <Button variant="primary" size="sm" onPress={() => updateOrderStatus(item.id, 'shipped')}>
            Mark as Shipped
          </Button>
        )}
        {item.status === 'shipped' && (
          <Button variant="secondary" size="sm" disabled>
            Awaiting Delivery
          </Button>
        )}
        <Button variant="outline" size="sm" onPress={() => {}}>
          View Details
        </Button>
      </View>
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} orders</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterTab, filter === status && styles.filterTabActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No orders</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
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
  filterTabs: {
    flexDirection: 'row',
    padding: spacing.sm,
    backgroundColor: colors.background,
    gap: spacing.xs,
    overflowX: 'auto',
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
  },
  filterTabActive: {
    backgroundColor: colors.secondary,
  },
  filterText: {
    ...typography.small,
    color: colors.text,
    whiteSpace: 'nowrap',
  },
  filterTextActive: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderNumber: {
    ...typography.h4,
    color: colors.text,
  },
  orderDate: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.small,
    color: colors.primaryForeground,
    fontWeight: '700',
  },
  orderDetails: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
    width: 80,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textSecondary,
  },
})
