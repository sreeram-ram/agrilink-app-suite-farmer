import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Container, Card } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '2,456', icon: '👥', change: '+12%' },
    { label: 'Active Farmers', value: '89', icon: '👨‍🌾', change: '+5%' },
    { label: 'Active Drivers', value: '45', icon: '🚴', change: '+8%' },
    { label: 'Total Orders', value: '1,234', icon: '📦', change: '+15%' },
    { label: 'Revenue', value: '₹4.5L', icon: '💰', change: '+22%' },
    { label: 'Pending Issues', value: '12', icon: '⚠️', change: '-3%' },
  ]

  const recentActivity = [
    { type: 'order', message: 'New order #ORD12345 placed', time: '2 min ago' },
    { type: 'user', message: 'New farmer registered: Ramesh Farm', time: '15 min ago' },
    { type: 'driver', message: 'Driver Amit completed delivery', time: '30 min ago' },
    { type: 'issue', message: 'Customer reported issue with order', time: '1 hr ago' },
    { type: 'order', message: 'Order #ORD12340 delivered', time: '2 hr ago' },
  ]

  const topPerformers = [
    { name: 'Green Valley Farms', orders: 156, revenue: '₹45,000' },
    { name: 'Organic Heights', orders: 134, revenue: '₹38,500' },
    { name: 'Fresh Farms Co.', orders: 98, revenue: '₹28,000' },
  ]

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>⚙️ Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Platform overview</Text>
        </View>
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>Admin</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} variant="elevated" style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[
                  styles.statChange,
                  stat.change.startsWith('+') ? styles.positive : styles.negative
                ]}>
                  {stat.change}
                </Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Revenue Chart */}
        <Card variant="elevated" style={styles.chartCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>📈 Revenue Trend</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.chartPlaceholder}>
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={[styles.bar, { height: `${height}%` }]} />
                  <Text style={styles.barLabel}>{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated" style={styles.activityCard}>
          <Card.Header>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>📋 Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All →</Text>
              </TouchableOpacity>
            </View>
          </Card.Header>
          <Card.Content>
            {recentActivity.map((item, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityMessage}>{item.message}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Top Performers */}
        <Card variant="elevated" style={styles.performersCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>🏆 Top Performing Farmers</Text>
          </Card.Header>
          <Card.Content>
            {topPerformers.map((item, index) => (
              <View key={index} style={styles.performerItem}>
                <View style={styles.performerRank}>#{index + 1}</View>
                <View style={styles.performerInfo}>
                  <Text style={styles.performerName}>{item.name}</Text>
                  <Text style={styles.performerOrders}>{item.orders} orders</Text>
                </View>
                <Text style={styles.performerRevenue}>{item.revenue}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated" style={styles.actionsCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>⚡ Quick Actions</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>👤</Text>
                <Text style={styles.actionText}>Add Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📢</Text>
                <Text style={styles.actionText}>Broadcast</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>💵</Text>
                <Text style={styles.actionText}>Payouts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionText}>Reports</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DC2626',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  adminBadge: {
    backgroundColor: colors.primaryForeground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  adminText: {
    ...typography.small,
    color: '#DC2626',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    width: '31%',
    padding: spacing.md,
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statIcon: {
    fontSize: 18,
  },
  statChange: {
    ...typography.small,
    fontWeight: '600',
  },
  positive: {
    color: colors.primary,
  },
  negative: {
    color: colors.error,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  chartCard: {
    margin: spacing.md,
    marginTop: 0,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  viewAll: {
    ...typography.small,
    color: colors.primary,
  },
  chartPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: spacing.md,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 14,
    backgroundColor: '#DC2626',
    borderRadius: borderRadius.xs,
  },
  barLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  activityCard: {
    margin: spacing.md,
    marginTop: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    marginTop: 6,
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    ...typography.body,
    color: colors.text,
  },
  activityTime: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  performersCard: {
    margin: spacing.md,
    marginTop: 0,
  },
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  performerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  performerOrders: {
    ...typography.small,
    color: colors.textSecondary,
  },
  performerRevenue: {
    ...typography.h4,
    color: colors.primary,
  },
  actionsCard: {
    margin: spacing.md,
    marginBottom: spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.small,
    color: colors.text,
  },
})
