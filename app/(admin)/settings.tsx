import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'

export default function AdminSettings() {
  const [commission, setCommission] = useState('10')
  const [deliveryFee, setDeliveryFee] = useState('49')
  const [freeDelivery, setFreeDelivery] = useState('500')
  const [notifications, setNotifications] = useState({
    orders: true,
    users: true,
    payments: true,
    issues: true,
  })

  const handleSave = () => {
    Alert.alert('Settings Saved', 'Platform settings have been updated successfully.')
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Platform Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Commission Settings */}
        <Card variant="elevated" style={styles.card}>
          <Card.Header>
            <Text style={styles.cardTitle}>💰 Commission Settings</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Farmer Commission (%)</Text>
                <Text style={styles.settingDesc}>Platform fee deducted from farmer earnings</Text>
              </View>
              <Input
                value={commission}
                onChangeText={setCommission}
                keyboardType="numeric"
                style={styles.settingInput}
              />
            </View>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Driver Commission (%)</Text>
                <Text style={styles.settingDesc}>Earnings share for delivery partners</Text>
              </View>
              <Input
                value="15"
                keyboardType="numeric"
                style={styles.settingInput}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Delivery Settings */}
        <Card variant="elevated" style={styles.card}>
          <Card.Header>
            <Text style={styles.cardTitle}>🚚 Delivery Settings</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Base Delivery Fee (₹)</Text>
                <Text style={styles.settingDesc}>Minimum delivery charge</Text>
              </View>
              <Input
                value={deliveryFee}
                onChangeText={setDeliveryFee}
                keyboardType="numeric"
                style={styles.settingInput}
              />
            </View>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingLabel}>Free Delivery Threshold (₹)</Text>
                <Text style={styles.settingDesc}>Order value for free delivery</Text>
              </View>
              <Input
                value={freeDelivery}
                onChangeText={setFreeDelivery}
                keyboardType="numeric"
                style={styles.settingInput}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Notification Settings */}
        <Card variant="elevated" style={styles.card}>
          <Card.Header>
            <Text style={styles.cardTitle}>🔔 Notification Preferences</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.toggleItem}>
              <View>
                <Text style={styles.settingLabel}>New Orders</Text>
                <Text style={styles.settingDesc}>Get notified for new order placements</Text>
              </View>
              <Switch
                value={notifications.orders}
                onValueChange={(v) => setNotifications({ ...notifications, orders: v })}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            <View style={styles.toggleItem}>
              <View>
                <Text style={styles.settingLabel}>New Users</Text>
                <Text style={styles.settingDesc}>Notifications for new registrations</Text>
              </View>
              <Switch
                value={notifications.users}
                onValueChange={(v) => setNotifications({ ...notifications, users: v })}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            <View style={styles.toggleItem}>
              <View>
                <Text style={styles.settingLabel}>Payments</Text>
                <Text style={styles.settingDesc}>Payment and payout notifications</Text>
              </View>
              <Switch
                value={notifications.payments}
                onValueChange={(v) => setNotifications({ ...notifications, payments: v })}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            <View style={styles.toggleItem}>
              <View>
                <Text style={styles.settingLabel}>Issues & Reports</Text>
                <Text style={styles.settingDesc}>Customer complaints and issues</Text>
              </View>
              <Switch
                value={notifications.issues}
                onValueChange={(v) => setNotifications({ ...notifications, issues: v })}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Platform Info */}
        <Card variant="elevated" style={styles.card}>
          <Card.Header>
            <Text style={styles.cardTitle}>ℹ️ Platform Information</Text>
          </Card.Header>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Database</Text>
              <Text style={styles.infoValue}>Connected</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>API Status</Text>
              <Text style={styles.infoValue}>● Active</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>March 5, 2026</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Save Button */}
        <View style={styles.footer}>
          <Button variant="primary" size="lg" onPress={handleSave} style={styles.saveButton}>
            Save Settings
          </Button>
        </View>
      </ScrollView>
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
  card: {
    margin: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  settingDesc: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  settingInput: {
    width: 80,
    textAlign: 'center',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  saveButton: {
    width: '100%',
  },
})
