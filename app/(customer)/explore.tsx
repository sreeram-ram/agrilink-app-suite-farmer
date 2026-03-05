import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { blink } from '@/lib/blink'

export default function ExploreScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOrganic, setFilterOrganic] = useState(false)
  const [filterSeasonal, setFilterSeasonal] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [filterOrganic, filterSeasonal])

  const loadProducts = async () => {
    try {
      let query: any = { limit: 50 }
      if (filterOrganic || filterSeasonal) {
        query.where = {}
        if (filterOrganic) query.where.isOrganic = '1'
        if (filterSeasonal) query.where.isSeasonal = '1'
      }
      const data = await blink.db.products.list(query)
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    !searchQuery || 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.origin?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Find fresh produce near you</Text>
      </View>

      <View style={styles.content}>
        {/* Search */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search vegetables, fruits..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Text>🔍</Text>}
          />
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterChip, filterOrganic && styles.filterChipActive]}
            onPress={() => setFilterOrganic(!filterOrganic)}
          >
            <Text style={[styles.filterText, filterOrganic && styles.filterTextActive]}>
              🌿 Organic
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filterSeasonal && styles.filterChipActive]}
            onPress={() => setFilterSeasonal(!filterSeasonal)}
          >
            <Text style={[styles.filterText, filterSeasonal && styles.filterTextActive]}>
              🍎 Seasonal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Products List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card 
              variant="elevated" 
              style={styles.productCard}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <View style={styles.productContent}>
                <View style={styles.productInfo}>
                  <View style={styles.badges}>
                    {item.isOrganic === '1' && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>Organic</Text>
                      </View>
                    )}
                    {item.isSeasonal === '1' && (
                      <View style={[styles.badge, styles.seasonalBadge]}>
                        <Text style={styles.badgeText}>Seasonal</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productOrigin}>📍 {item.origin}</Text>
                  <Text style={styles.productDesc}>{item.description}</Text>
                </View>
                <View style={styles.productAction}>
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                  <Text style={styles.productUnit}>/ {item.unit}</Text>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onPress={() => router.push(`/product/${item.id}`)}
                    style={styles.addButton}
                  >
                    Add
                  </Button>
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
          contentContainerStyle={styles.list}
        />
      </View>
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
  headerSubtitle: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  searchSection: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.small,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.primaryForeground,
  },
  list: {
    padding: spacing.md,
  },
  productCard: {
    marginBottom: spacing.md,
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  seasonalBadge: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    ...typography.tiny,
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  productName: {
    ...typography.h4,
    color: colors.text,
  },
  productOrigin: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  productDesc: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  productAction: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  productPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  productUnit: {
    ...typography.small,
    color: colors.textSecondary,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
})
