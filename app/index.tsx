import { useState } from 'react'
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Card, Button, Input, Container } from '@/components/ui'
import { colors, spacing, typography, shadows } from '@/constants/design'
import { useAuth, login, signUp } from '@/hooks/useAuth'
import { blink } from '@/lib/blink'

export default function AuthScreen() {
  const router = useRouter()
  const { isLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<'customer' | 'farmer' | 'driver'>('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await signUp(email, password, displayName, role)
      }
      
      // Get user profile to determine role
      const profiles = await blink.db.user_profiles.list({
        where: { userId: (await blink.auth.me())?.id },
        limit: 1,
      })

      const userRole = profiles[0]?.role || 'customer'
      
      // Redirect based on role
      switch (userRole) {
        case 'farmer':
          router.replace('/(farmer)')
          break
        case 'driver':
          router.replace('/(driver)')
          break
        case 'admin':
          router.replace('/(admin)')
          break
        default:
          router.replace('/(customer)')
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  // For demo - skip auth and go directly to panels
  const goToCustomer = () => router.replace('/(customer)')
  const goToFarmer = () => router.replace('/(farmer)')
  const goToDriver = () => router.replace('/(driver)')
  const goToAdmin = () => router.replace('/(admin)')

  return (
    <Container safeArea edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🌾</Text>
            </View>
            <Text style={styles.title}>AgriLink</Text>
            <Text style={styles.subtitle}>Farm to Table Fresh</Text>
          </View>

          {/* Demo Access */}
          <Card variant="elevated" style={styles.demoCard}>
            <Card.Header>
              <Text style={styles.cardTitle}>Quick Demo Access</Text>
            </Card.Header>
            <Card.Content>
              <Text style={styles.demoText}>Choose a panel to explore:</Text>
              <View style={styles.demoButtons}>
                <Button variant="primary" size="sm" onPress={goToCustomer} style={styles.demoButton}>
                  Customer
                </Button>
                <Button variant="secondary" size="sm" onPress={goToFarmer} style={styles.demoButton}>
                  Farmer
                </Button>
                <Button variant="outline" size="sm" onPress={goToDriver} style={styles.demoButton}>
                  Driver
                </Button>
                <Button variant="ghost" size="sm" onPress={goToAdmin} style={styles.demoButton}>
                  Admin
                </Button>
              </View>
            </Card.Content>
          </Card>

          {/* Auth Form */}
          <Card variant="elevated" style={styles.authCard}>
            <Card.Content>
              <View style={styles.tabs}>
                <Button 
                  variant={isLogin ? 'primary' : 'ghost'} 
                  size="sm"
                  onPress={() => setIsLogin(true)}
                  style={styles.tab}
                >
                  Login
                </Button>
                <Button 
                  variant={!isLogin ? 'primary' : 'ghost'} 
                  size="sm"
                  onPress={() => setIsLogin(false)}
                  style={styles.tab}
                >
                  Sign Up
                </Button>
              </View>

              {!isLogin && (
                <Input
                  label="Full Name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  style={styles.input}
                />
              )}

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
                style={styles.input}
              />

              {!isLogin && (
                <View style={styles.roleSelector}>
                  <Text style={styles.roleLabel}>I am a:</Text>
                  <View style={styles.roleButtons}>
                    <Button
                      variant={role === 'customer' ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setRole('customer')}
                      style={styles.roleButton}
                    >
                      Customer
                    </Button>
                    <Button
                      variant={role === 'farmer' ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setRole('farmer')}
                      style={styles.roleButton}
                    >
                      Farmer
                    </Button>
                    <Button
                      variant={role === 'driver' ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setRole('driver')}
                      style={styles.roleButton}
                    >
                      Driver
                    </Button>
                  </View>
                </View>
              )}

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Button
                variant="primary"
                onPress={handleAuth}
                loading={loading}
                style={styles.authButton}
              >
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
            </Card.Content>
          </Card>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🥬</Text>
              <Text style={styles.featureText}>Fresh Produce</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚜</Text>
              <Text style={styles.featureText}>Direct Farmers</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📍</Text>
              <Text style={styles.featureText}>Local Delivery</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  demoCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryTint,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.primaryDark,
  },
  demoText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  demoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  demoButton: {
    flex: 1,
    minWidth: 70,
  },
  authCard: {
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
  },
  input: {
    marginBottom: spacing.md,
  },
  roleSelector: {
    marginBottom: spacing.md,
  },
  roleLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleButton: {
    flex: 1,
  },
  error: {
    ...typography.body,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  authButton: {
    marginTop: spacing.sm,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  featureText: {
    ...typography.small,
    color: colors.textSecondary,
  },
})
