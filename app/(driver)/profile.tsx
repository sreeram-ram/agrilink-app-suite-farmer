import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Container, Card, Button, Avatar } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

export default function DriverProfile() {
  const router = useRouter()

  const menuItems = [
    { icon: '🚗', title: 'Vehicle Details', subtitle: 'Bike registration', onPress: () => {} },
    { icon: '📋', title: 'Documents', subtitle: 'License, ID proof', onPress: () => {} },
    { icon: '🏆', title: 'Achievements', subtitle: 'Badges and rewards', onPress: () => {} },
    { icon: '📊', title: 'Performance Stats', subtitle: 'Rating & metrics', onPress: () => {} },
    { icon: '💬', title: 'Support Chat', subtitle: 'Contact support', onPress: () => {} },
    { icon: '🔔', title: 'Notifications', subtitle: 'Push settings', onPress: () => {} },
    { icon: '❓', title: 'Help Center', subtitle: 'FAQs', onPress: () => {} },
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
          <Text style={styles.headerTitle}>🚴 Driver Profile</Text>
        </View>

        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Avatar size="xl" style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </Avatar>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Amit Kumar</Text>
              <Text style={styles.profileEmail}>amit@example.com</Text>
              <Text style={styles.profilePhone}>📱 +91 98765 43210</Text>
            </View>
            <Button variant="ghost" size="sm">Edit</Button>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statValue}>4.9 ⭐</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statValue}>1,234</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Accept Rate</Text>
          </Card>
        </View>

        {/* Online Status */}
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusContent}>
            <View>
              <Text style={styles.statusTitle}>You're Online</Text>
              <Text style={styles.statusSubtitle}>Ready to receive orders</Text>
            </View>
            <View style={styles.toggleButton}>
              <Text style={styles.toggleText}>Go Offline</Text>
            </View>
          </View>
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
    backgroundColor: '#7C3AED',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primaryForeground,
  },
  profileCard: {
    margin: spacing.md,
    marginTop: -spacing.xl,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#7C3AED',
  },
  avatarText: {
    ...typography.h2,
    color: colors.primaryForeground,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    ...typography.h4,
    color: colors.text,
  },
  profileEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  profilePhone: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
    color: '#7C3AED',
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusCard: {
    margin: spacing.md,
    backgroundColor: '#7C3AED',
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    ...typography.h4,
    color: colors.primaryForeground,
  },
  statusSubtitle: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  toggleButton: {
    backgroundColor: colors.primaryForeground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  toggleText: {
    ...typography.small,
    color: '#7C3AED',
    fontWeight: '600',
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
