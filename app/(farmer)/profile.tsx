import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Container, Card, Button, Avatar } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

export default function FarmerProfile() {
  const router = useRouter()

  const menuItems = [
    { icon: '👨‍🌾', title: 'Farm Profile', subtitle: 'Manage farm details', onPress: () => {} },
    { icon: '📸', title: 'Farm Gallery', subtitle: 'Add farm photos', onPress: () => {} },
    { icon: '📋', title: 'Certifications', subtitle: 'Organic certificates', onPress: () => {} },
    { icon: '💰', title: 'Bank Details', subtitle: 'Payout settings', onPress: () => {} },
    { icon: '💬', title: 'Customer Messages', subtitle: 'View chats', onPress: () => {} },
    { icon: '🔔', title: 'Notifications', subtitle: 'Push settings', onPress: () => {} },
    { icon: '❓', title: 'Help & Support', subtitle: 'Get help', onPress: () => {} },
  ]

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => router.replace('/')
      },
    ])
  }

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>👨‍🌾 My Farm</Text>
        </View>

        {/* Farm Card */}
        <Card variant="elevated" style={styles.farmCard}>
          <View style={styles.farmContent}>
            <Avatar size="xl" style={styles.farmAvatar}>
              <Text style={styles.avatarText}>🌾</Text>
            </Avatar>
            <View style={styles.farmInfo}>
              <Text style={styles.farmName}>Green Valley Farms</Text>
              <Text style={styles.farmLocation}>📍 Pune, Maharashtra</Text>
              <View style={styles.farmBadges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓ Verified</Text>
                </View>
                <View style={[styles.badge, styles.organicBadge]}>
                  <Text style={styles.badgeText}>🌿 Organic</Text>
                </View>
              </View>
            </View>
            <Button variant="ghost" size="sm">Edit</Button>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statValue}>4.8 ⭐</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </Card>
        </View>

        {/* Farm Details */}
        <Card variant="elevated" style={styles.detailsCard}>
          <Card.Header>
            <Text style={styles.cardTitle}>🏡 Farm Details</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Farm Size:</Text>
              <Text style={styles.detailValue}>15 acres</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Farming Type:</Text>
              <Text style={styles.detailValue}>Organic</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Certification:</Text>
              <Text style={styles.detailValue}>NPOP Certified</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Joined:</Text>
              <Text style={styles.detailValue}>January 2024</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Commission:</Text>
              <Text style={styles.detailValue}>10%</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.title} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.footer}>
          <Button variant="outline" onPress={handleLogout} style={styles.logoutButton}>
            Logout
          </Button>
        </View>
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
  farmCard: {
    margin: spacing.md,
    marginTop: -spacing.xl,
  },
  farmContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmAvatar: {
    backgroundColor: colors.secondaryTint,
  },
  avatarText: {
    fontSize: 32,
  },
  farmInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  farmName: {
    ...typography.h4,
    color: colors.text,
  },
  farmLocation: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  farmBadges: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  organicBadge: {
    backgroundColor: colors.secondaryTint,
  },
  badgeText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: {
    ...typography.h4,
    color: colors.primary,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  detailsCard: {
    margin: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuEmoji: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  menuSubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuArrow: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
  },
})
