import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { Container, Card, Button } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'
import { blink } from '@/lib/blink'

export default function FarmerDashboard() {
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    products: 0,
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const orders = await blink.db.orders.list({ limit: 100 })
      const products = await blink.db.products.list({ limit: 50 })
      
      const pending = orders.filter((o: any) => o.status === 'pending' || o.status === 'confirmed')
      const earnings = orders
        .filter((o: any) => o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + (o.farmerCommission || 0), 0)

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending.length,
        totalEarnings: earnings,
        products: products.length,
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDashboard()
    setRefreshing(false)
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.farmName}>Green Valley Farms</Text>
        </View>
        <View style={styles.verificationBadge}>
          <Text style={styles.verified}>✓ Verified</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card variant="elevated" style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </Card>
          <Card variant="elevated" style={[styles.statCard, styles.statCardWarning]}>
            <Text style={styles.statIcon}>⏳</Text>
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card variant="elevated" style={[styles.statCard, styles.statCardSuccess]}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>₹{stats.totalEarnings}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </Card>
          <Card variant="elevated" style={[styles.statCard, styles.statCardInfo]}>
            <Text style={styles.statIcon}>🥬</Text>
            <Text style={styles.statValue}>{stats.products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionText}>Pack Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Messages</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          <Card variant="elevated" style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>ORD12345</Text>
                <Text style={styles.orderTime}>2 hours ago</Text>
              </View>
              <View style={styles.orderStatus}>
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>
            <View style={styles.orderItems}>
              <Text style={styles.itemsText}>3 items • ₹450</Text>
              <Text style={styles.customerText}>Customer: Priya S.</Text>
            </View>
            <View style={styles.orderActions}>
              <Button variant="primary" size="sm">Accept</Button>
              <Button variant="outline" size="sm">Details</Button>
            </View>
          </Card>

          <Card variant="elevated" style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>ORD12344</Text>
                <Text style={styles.orderTime}>5 hours ago</Text>
              </View>
              <View style={[styles.orderStatus, styles.statusConfirmed]}>
                <Text style={[styles.statusText, styles.statusTextConfirmed]}>Confirmed</Text>
              </View>
            </View>
            <View style={styles.orderItems}>
              <Text style={styles.itemsText}>5 items • ₹890</Text>
              <Text style={styles.customerText}>Customer: Amit K.</Text>
            </View>
            <View style={styles.orderActions}>
              <Button variant="primary" size="sm">Mark Packed</Button>
              <Button variant="outline" size="sm">Details</Button>
            </View>
          </Card>
        </View>

        {/* Performance Card */}
        <Card variant="elevated" style={styles.performanceCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>📈 This Month</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <Text style={styles.perfValue}>₹15,000</Text>
                <Text style={styles.perfLabel}>Revenue</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.perfValue}>45</Text>
                <Text style={styles.perfLabel}>Orders</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.perfValue}>4.8 ⭐</Text>
                <Text style={styles.perfLabel}>Rating</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.9,
  },
  farmName: {
    ...typography.h3,
    color: colors.primaryForeground,
    marginTop: spacing.xs,
  },
  verificationBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  verified: {
    ...typography.small,
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    width: '48%',
    padding: spacing.md,
    alignItems: 'center',
  },
  statCardPrimary: {
    backgroundColor: colors.primaryTint,
  },
  statCardWarning: {
    backgroundColor: colors.accentTint,
  },
  statCardSuccess: {
    backgroundColor: colors.secondaryTint,
  },
  statCardInfo: {
    backgroundColor: colors.primaryTint,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  seeAll: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.small,
    color: colors.text,
    fontWeight: '500',
  },
  orderCard: {
    marginBottom: spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.h4,
    color: colors.text,
  },
  orderTime: {
    ...typography.small,
    color: colors.textSecondary,
  },
  orderStatus: {
    backgroundColor: colors.accentTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusConfirmed: {
    backgroundColor: colors.primaryTint,
  },
  statusText: {
    ...typography.small,
    color: colors.accent,
    fontWeight: '600',
  },
  statusTextConfirmed: {
    color: colors.primary,
  },
  orderItems: {
    marginBottom: spacing.sm,
  },
  itemsText: {
    ...typography.body,
    color: colors.text,
  },
  customerText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  orderActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  performanceCard: {
    margin: spacing.md,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceItem: {
    alignItems: 'center',
  },
  perfValue: {
    ...typography.h4,
    color: colors.primary,
  },
  perfLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
})
