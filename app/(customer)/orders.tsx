import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Container, Card, Button } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'
import { blink } from '@/lib/blink'

const statusColors: { [key: string]: string } = {
  pending: colors.accent,
  confirmed: colors.primary,
  packed: colors.secondary,
  shipped: colors.primaryLight,
  delivered: colors.primary,
  cancelled: colors.error,
}

const statusSteps = ['pending', 'confirmed', 'packed', 'shipped', 'delivered']

export default function OrdersScreen() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await blink.db.orders.list({
        where: { userId: 'demo_user' },
        orderBy: { orderedAt: 'desc' },
        limit: 20,
      })
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status: string) => statusSteps.indexOf(status)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderOrder = ({ item }: { item: any }) => (
    <Card 
      variant="elevated" 
      style={styles.orderCard}
      onPress={() => setSelectedOrder(selectedOrder === item.id ? null : item.id)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderedAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] || colors.secondary }]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          {statusSteps.map((step, index) => {
            const currentIndex = getStatusIndex(item.status || 'pending')
            const isCompleted = index <= currentIndex
            const isCurrent = index === currentIndex
            return (
              <View key={step} style={styles.progressStep}>
                <View style={[
                  styles.progressDot,
                  isCompleted && styles.progressDotCompleted,
                  isCurrent && styles.progressDotCurrent,
                ]}>
                  {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                {index < statusSteps.length - 1 && (
                  <View style={[
                    styles.progressLine,
                    index < currentIndex && styles.progressLineCompleted,
                  ]} />
                )}
              </View>
            )
          })}
        </View>
        <View style={styles.progressLabels}>
          {['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((label, i) => (
            <Text key={label} style={[
              styles.progressLabel,
              i <= getStatusIndex(item.status || 'pending') && styles.progressLabelActive,
            ]}>
              {label}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>Total: ₹{item.total}</Text>
        <Text style={styles.viewDetails}>
          {selectedOrder === item.id ? 'Hide Details ▲' : 'View Details ▼'}
        </Text>
      </View>

      {selectedOrder === item.id && (
        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Address:</Text>
            <Text style={styles.detailValue}>{item.deliveryAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💳 Payment:</Text>
            <Text style={styles.detailValue}>{item.paymentMethod?.toUpperCase()} - {item.paymentStatus}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>💰 Subtotal:</Text>
            <Text style={styles.detailValue}>₹{item.subtotal}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🚚 Delivery:</Text>
            <Text style={styles.detailValue}>₹{item.deliveryFee}</Text>
          </View>
        </View>
      )}
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 My Orders</Text>
        <Text style={styles.headerSubtitle}>Track your fresh produce deliveries</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>Start ordering fresh produce!</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primaryForeground,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
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
  progressSection: {
    marginBottom: spacing.md,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  progressDotCurrent: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  checkmark: {
    color: colors.primaryForeground,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  progressLineCompleted: {
    backgroundColor: colors.primary,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  progressLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  progressLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  orderTotal: {
    ...typography.h4,
    color: colors.primary,
  },
  viewDetails: {
    ...typography.small,
    color: colors.primary,
  },
  orderDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
    width: 100,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
})
