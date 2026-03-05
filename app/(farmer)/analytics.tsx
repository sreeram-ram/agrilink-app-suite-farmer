import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Container, Card } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

export default function FarmerAnalytics() {
  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Analytics</Text>
        <Text style={styles.headerSubtitle}>Your farm performance</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Revenue Card */}
        <Card variant="elevated" style={styles.revenueCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>💰 Total Revenue</Text>
          </Card.Header>
          <Card.Content>
            <Text style={styles.revenueValue}>₹45,280</Text>
            <View style={styles.revenueChange}>
              <Text style={styles.changePositive}>↑ 12.5%</Text>
              <Text style={styles.changeText}>vs last month</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>2.3h</Text>
            <Text style={styles.statLabel}>Avg Prep Time</Text>
          </Card>
        </View>

        {/* Top Products */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>🏆 Top Products</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.productList}>
              <View style={styles.productItem}>
                <View style={styles.productRank}>1</View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Organic Tomatoes</Text>
                  <Text style={styles.productSales}>₹12,500 • 278 units</Text>
                </View>
              </View>
              <View style={styles.productItem}>
                <View style={styles.productRank}>2</View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Fresh Spinach</Text>
                  <Text style={styles.productSales}>₹8,200 • 164 units</Text>
                </View>
              </View>
              <View style={styles.productItem}>
                <View style={styles.productRank}>3</View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Green Potatoes</Text>
                  <Text style={styles.productSales}>₹6,800 • 136 units</Text>
                </View>
              </View>
              <View style={styles.productItem}>
                <View style={styles.productRank}>4</View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Alphonso Mangoes</Text>
                  <Text style={styles.productSales}>₹5,600 • 56 units</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Monthly Trend */}
        <Card variant="elevated" style={styles.sectionCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>📈 Monthly Trend</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.chartPlaceholder}>
              {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 100].map((height, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={[styles.bar, { height: `${height}%` }]} />
                  <Text style={styles.barLabel}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Customer Locations */}
        <Card variant="elevated" style={[styles.sectionCard, styles.lastCard]}>
          <Card.Header>
            <Text style={styles.cardTitle}>📍 Top Delivery Areas</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.locationItem}>
              <Text style={styles.locationName}>Pune City</Text>
              <Text style={styles.locationPercent}>45%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '45%' }]} />
              </View>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationName}>Mumbai Suburbs</Text>
              <Text style={styles.locationPercent}>30%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '30%' }]} />
              </View>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationName}>Nashik</Text>
              <Text style={styles.locationPercent}>15%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '15%' }]} />
              </View>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationName}>Others</Text>
              <Text style={styles.locationPercent}>10%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: '10%' }]} />
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
  revenueCard: {
    margin: spacing.md,
    marginTop: -spacing.xl,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  revenueValue: {
    ...typography.display,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  revenueChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  changePositive: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  changeText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
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
    marginTop: spacing.xs,
  },
  sectionCard: {
    margin: spacing.md,
    marginBottom: 0,
  },
  lastCard: {
    marginBottom: spacing.xl,
  },
  productList: {
    gap: spacing.md,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  productSales: {
    ...typography.small,
    color: colors.textSecondary,
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
    width: 16,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xs,
  },
  barLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  locationItem: {
    marginBottom: spacing.md,
  },
  locationName: {
    ...typography.body,
    color: colors.text,
  },
  locationPercent: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
})
