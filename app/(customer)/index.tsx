import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { blink } from '@/lib/blink'

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  isOrganic: boolean
  isSeasonal: boolean
  origin: string
  imageUrls: string
}

interface Category {
  id: string
  name: string
  icon: string
}

export default function CustomerHome() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        blink.db.products.list({ limit: 20 }),
        blink.db.categories.list({ limit: 10 }),
      ])
      setProducts(productsData as Product[])
      setCategories(categoriesData as Category[])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const renderProduct = ({ item }: { item: Product }) => (
    <Card 
      variant="elevated" 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.productImageContainer}>
        {item.imageUrls ? (
          <Image source={{ uri: item.imageUrls }} style={styles.productImage} />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.productEmoji}>🥬</Text>
          </View>
        )}
        {item.isOrganic && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Organic</Text>
          </View>
        )}
        {item.isSeasonal && (
          <View style={[styles.badge, styles.seasonalBadge]}>
            <Text style={styles.badgeText}>Seasonal</Text>
          </View>
        )}
      </View>
      <Card.Content>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productOrigin}>{item.origin}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          <Text style={styles.productUnit}>/ {item.unit}</Text>
        </View>
      </Card.Content>
      <Card.Footer>
        <Button 
          variant="primary" 
          size="sm" 
          onPress={() => addToCart(item)}
        >
          Add to Cart
        </Button>
      </Card.Footer>
    </Card>
  )

  const addToCart = async (product: Product) => {
    try {
      await blink.db.cart_items.create({
        id: `cart_${Date.now()}`,
        userId: 'demo_user',
        productId: product.id,
        quantity: 1,
        price: product.price,
      })
      router.push('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const categoryIcons: { [key: string]: string } = {
    'cat_veg': '🥬',
    'cat_fruit': '🍎',
    'cat_dairy': '🥛',
    'cat_grains': '🌾',
    'cat_honey': '🍯',
    'cat_herbs': '🌿',
  }

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <Text style={styles.headerTitle}>Fresh from Farm</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>P</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search fresh produce..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Text>🔍</Text>}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryEmoji}>
                  {categoryIcons[cat.id] || '🍽️'}
                </Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Banner */}
        <Card variant="elevated" style={styles.bannerCard}>
          <Card.Content>
            <View style={styles.bannerContent}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>Farm Fresh Box</Text>
                <Text style={styles.bannerSubtitle}>Get fresh produce weekly</Text>
                <Button variant="primary" size="sm" style={styles.bannerButton}>
                  Subscribe Now
                </Button>
              </View>
              <Text style={styles.bannerEmoji}>📦</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fresh Products</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  greeting: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.9,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primaryForeground,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.h4,
    color: colors.primary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  section: {
    paddingVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  seeAll: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
    marginLeft: spacing.md,
    gap: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.primaryForeground,
  },
  bannerCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    backgroundColor: colors.secondary,
    ...shadows.md,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    ...typography.h3,
    color: colors.primaryForeground,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
  },
  bannerEmoji: {
    fontSize: 60,
  },
  productList: {
    paddingHorizontal: spacing.md,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  productImageContainer: {
    height: 100,
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
  },
  productEmoji: {
    fontSize: 40,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
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
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  productOrigin: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  productPrice: {
    ...typography.h4,
    color: colors.primary,
  },
  productUnit: {
    ...typography.small,
    color: colors.textSecondary,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
})
