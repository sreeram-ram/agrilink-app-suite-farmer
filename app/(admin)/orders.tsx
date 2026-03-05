import { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Container, Card } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'

const mockOrders = [
  { id: '1', orderNumber: 'ORD12345', customer: 'Priya Sharma', farmer: 'Green Valley Farms', amount: 450, status: 'delivered', date: 'Mar 5, 2026' },
  { id: '2', orderNumber: 'ORD12344', customer: 'Amit Kumar', farmer: 'Organic Heights', amount: 890, status: 'shipped', date: 'Mar 5, 2026' },
  { id: '3', orderNumber: 'ORD12343', customer: 'Sneha Patil', farmer: 'Fresh Farms', amount: 320, status: 'packed', date: 'Mar 4, 2026' },
  { id: '4', orderNumber: 'ORD12342', customer: 'Raj Malhotra', farmer: 'Green Valley Farms', amount: 1250, status: 'confirmed', date: 'Mar 4, 2026' },
  { id: '5', orderNumber: 'ORD12341', customer: 'Anjali Desai', farmer: 'Organic Heights', amount: 680, status: 'pending', date: 'Mar 4, 2026' },
  { id: '6', orderNumber: 'ORD12340', customer: 'Vikram S.', farmer: 'Fresh Farms', amount: 210, status: 'cancelled', date: 'Mar 3, 2026' },
]

const statusColors: { [key: string]: string } = {
  pending: colors.accent,
  confirmed: colors.primary,
  packed: colors.secondary,
  shipped: colors.primaryLight,
  delivered: colors.primary,
  cancelled: colors.error,
}

export default function AdminOrders() {
  const [filter, setFilter] = useState('all')

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(o => o.status === filter)

  const renderOrder = ({ item }: { item: typeof mockOrders[0] }) => (
    <Card variant="elevated" style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
          <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Customer:</Text>
          <Text style={styles.detailValue}>{item.customer}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Farmer:</Text>
          <Text style={styles.detailValue}>{item.farmer}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderAmount}>₹{item.amount}</Text>
        <View style={styles.orderActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Track</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 Order Management</Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filter === status && styles.filterChipActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{mockOrders.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>₹{mockOrders.reduce((s, o) => s + o.amount, 0).toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Revenue</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{mockOrders.filter(o => o.status === 'delivered').length}</Text>
          <Text style={styles.summaryLabel}>Delivered</Text>
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DC2626',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primaryForeground,
  },
  filters: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.xs,
    flexWrap: 'wrap',
    backgroundColor: colors.background,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
  },
  filterChipActive: {
    backgroundColor: '#DC2626',
  },
  filterText: {
    ...typography.small,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  summary: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h4,
    color: colors.text,
  },
  summaryLabel: {
    ...typography.small,
    color: colors.textSecondary,
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
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.h4,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDetails: {
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    ...typography.h4,
    color: colors.primary,
  },
  orderActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
})
