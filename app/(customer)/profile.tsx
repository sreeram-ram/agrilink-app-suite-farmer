import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Container, Card, Button, Avatar } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

interface MenuItem {
  icon: string
  title: string
  subtitle?: string
  onPress: () => void
}

export default function ProfileScreen() {
  const router = useRouter()

  const menuItems: MenuItem[] = [
    { icon: '📦', title: 'My Orders', subtitle: 'View all orders', onPress: () => router.push('/orders') },
    { icon: '📍', title: 'Saved Addresses', subtitle: 'Manage delivery addresses', onPress: () => {} },
    { icon: '💳', title: 'Payment Methods', subtitle: 'UPI, Cards, Wallets', onPress: () => {} },
    { icon: '🔔', title: 'Notifications', subtitle: 'Push notification preferences', onPress: () => {} },
    { icon: '❤️', title: 'Wishlist', subtitle: 'Saved products', onPress: () => {} },
    { icon: '🎁', title: 'Subscriptions', subtitle: 'Manage farm box subscriptions', onPress: () => {} },
    { icon: '👨‍🌾', title: 'Meet the Farmers', subtitle: 'Connect with farmers', onPress: () => {} },
    { icon: '💬', title: 'Chat with Farmers', subtitle: 'Direct communication', onPress: () => {} },
    { icon: '❓', title: 'Help & Support', subtitle: 'FAQs and support', onPress: () => {} },
    { icon: '⚙️', title: 'Settings', subtitle: 'App preferences', onPress: () => {} },
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
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* User Card */}
        <Card variant="elevated" style={styles.userCard}>
          <View style={styles.userContent}>
            <Avatar size="xl" style={styles.avatar}>
              <Text style={styles.avatarText}>P</Text>
            </Avatar>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Priya Sharma</Text>
              <Text style={styles.userEmail}>priya@example.com</Text>
              <Text style={styles.userLocation}>📍 Mumbai, Maharashtra</Text>
            </View>
            <Button variant="ghost" size="sm" onPress={() => {}}>
              Edit
            </Button>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Subscriptions</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Text style={styles.statNumber}>₹2.5k</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </Card>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
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
          <Button 
            variant="outline" 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </Button>
          <Text style={styles.version}>AgriLink v1.0.0</Text>
        </View>
      </ScrollView>
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
  userCard: {
    margin: spacing.md,
    marginTop: -spacing.xl,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  avatarText: {
    ...typography.h1,
    color: colors.primaryForeground,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.h4,
    color: colors.text,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  userLocation: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statNumber: {
    ...typography.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
    marginBottom: spacing.md,
  },
  version: {
    ...typography.small,
    color: colors.textSecondary,
  },
})
