import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Container, Card } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

export default function DriverEarnings() {
  const earnings = [
    { day: 'Today', amount: 850, deliveries: 8 },
    { day: 'Yesterday', amount: 1200, deliveries: 12 },
    { day: 'Monday', amount: 950, deliveries: 9 },
    { day: 'Sunday', amount: 1400, deliveries: 14 },
    { day: 'Saturday', amount: 1100, deliveries: 11 },
  ]

  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0)
  const totalDeliveries = earnings.reduce((sum, e) => sum + e.deliveries, 0)

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 Earnings</Text>
        <Text style={styles.headerSubtitle}>Your delivery performance</Text>
      </View>

      {/* Total Earnings Card */}
      <Card variant="elevated" style={styles.totalCard}>
        <View style={styles.totalContent}>
          <View>
            <Text style={styles.totalLabel}>Total Earnings</Text>
            <Text style={styles.totalValue}>₹{totalEarnings.toLocaleString()}</Text>
          </View>
          <View style={styles.totalStats}>
            <Text style={styles.totalStatValue}>{totalDeliveries}</Text>
            <Text style={styles.totalStatLabel}>Deliveries</Text>
          </View>
        </View>
      </Card>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statLabel}>This Week</Text>
          <Text style={styles.statValue}>₹5,500</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statValue}>₹22,800</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statLabel}>Avg/Delivery</Text>
          <Text style={styles.statValue}>₹108</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Text style={styles.statLabel}>Rating</Text>
          <Text style={styles.statValue}>4.9 ⭐</Text>
        </Card>
      </View>

      {/* Earnings Breakdown */}
      <Card variant="elevated" style={styles.breakdownCard}>
        <Card.Header>
          <Text style={styles.cardTitle}>📊 Earnings Breakdown</Text>
        </Card.Header>
        <Card.Content>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Base Fare (54 deliveries)</Text>
            <Text style={styles.breakdownValue}>₹4,320</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Distance Bonus</Text>
            <Text style={styles.breakdownValue}>₹1,200</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Peak Hours Bonus</Text>
            <Text style={styles.breakdownValue}>₹650</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Tips</Text>
            <Text style={styles.breakdownValue}>₹450</Text>
          </View>
          <View style={[styles.breakdownItem, styles.breakdownTotal]}>
            <Text style={styles.breakdownTotalLabel}>Total</Text>
            <Text style={styles.breakdownTotalValue}>₹6,620</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Daily Breakdown */}
      <Card variant="elevated" style={styles.dailyCard}>
        <Card.Header>
          <Text style={styles.cardTitle}>📅 Daily Breakdown</Text>
        </Card.Header>
        <Card.Content>
          {earnings.map((item, index) => (
            <View key={index} style={styles.dailyRow}>
              <View style={styles.dailyInfo}>
                <Text style={styles.dailyDay}>{item.day}</Text>
                <Text style={styles.dailyDeliveries}>{item.deliveries} deliveries</Text>
              </View>
              <Text style={styles.dailyAmount}>₹{item.amount}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Payout Info */}
      <Card variant="elevated" style={styles.payoutCard}>
        <Card.Header>
          <Text style={styles.cardTitle}>🏦 Payout Info</Text>
        </Card.Header>
        <Card.Content>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Next Payout</Text>
            <Text style={styles.payoutValue}>₹6,620</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Payout Date</Text>
            <Text style={styles.payoutValue}>March 7, 2026</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Bank</Text>
            <Text style={styles.payoutValue}>****4532</Text>
          </View>
        </Card.Content>
        <Card.Footer>
          <View style={styles.payoutButton}>
            <Text style={styles.payoutButtonText}>Request Payout</Text>
          </View>
        </Card.Footer>
      </Card>
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
  totalCard: {
    margin: spacing.md,
    marginTop: -spacing.xl,
    backgroundColor: '#7C3AED',
  },
  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.9,
  },
  totalValue: {
    ...typography.display,
    color: colors.primaryForeground,
    marginTop: spacing.xs,
  },
  totalStats: {
    alignItems: 'center',
  },
  totalStatValue: {
    ...typography.h2,
    color: colors.primaryForeground,
  },
  totalStatLabel: {
    ...typography.small,
    color: colors.primaryForeground,
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.xs,
  },
  breakdownCard: {
    margin: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  breakdownLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  breakdownValue: {
    ...typography.body,
    color: colors.text,
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  breakdownTotalLabel: {
    ...typography.h4,
    color: colors.text,
  },
  breakdownTotalValue: {
    ...typography.h4,
    color: '#7C3AED',
  },
  dailyCard: {
    margin: spacing.md,
  },
  dailyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dailyInfo: {
    flex: 1,
  },
  dailyDay: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  dailyDeliveries: {
    ...typography.small,
    color: colors.textSecondary,
  },
  dailyAmount: {
    ...typography.h4,
    color: '#7C3AED',
  },
  payoutCard: {
    margin: spacing.md,
    marginBottom: spacing.xl,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  payoutLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  payoutValue: {
    ...typography.body,
    color: colors.text,
  },
  payoutButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  payoutButtonText: {
    ...typography.body,
    color: colors.primaryForeground,
    fontWeight: '600',
  },
})
