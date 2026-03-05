import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Container, Card, Button, Avatar } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'
import { blink } from '@/lib/blink'

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      const data = await blink.db.products.get(id!)
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!product) return
    try {
      await blink.db.cart_items.create({
        id: `cart_${Date.now()}`,
        userId: 'demo_user',
        productId: product.id,
        quantity,
        price: product.price,
      })
      router.push('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading || !product) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.imageUrls ? (
            <Image source={{ uri: product.imageUrls }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.productEmoji}>🥬</Text>
            </View>
          )}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          {product.isOrganic === '1' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🌿 Organic</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productOrigin}>📍 {product.origin}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{product.price}</Text>
              <Text style={styles.unit}>/ {product.unit}</Text>
            </View>
          </View>

          {/* Stock */}
          <View style={styles.stockRow}>
            <Text style={styles.stockText}>
              {Number(product.stockQuantity) > 0 ? '✅ In Stock' : '❌ Out of Stock'}
            </Text>
            <Text style={styles.stockQty}>{product.stockQuantity} {product.unit} available</Text>
          </View>

          {/* Description */}
          <Card variant="elevated" style={styles.descriptionCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>Description</Text>
            </Card.Header>
            <Card.Content>
              <Text style={styles.description}>{product.description}</Text>
            </Card.Content>
          </Card>

          {/* Farmer Info */}
          <Card variant="elevated" style={styles.farmerCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>👨‍🌾 Meet the Farmer</Text>
            </Card.Header>
            <Card.Content>
              <TouchableOpacity style={styles.farmerContent} onPress={() => {}}>
                <Avatar size="lg" style={styles.farmerAvatar}>
                  <Text style={styles.avatarText}>🌾</Text>
                </Avatar>
                <View style={styles.farmerInfo}>
                  <Text style={styles.farmerName}>Green Valley Farms</Text>
                  <Text style={styles.farmerLocation}>📍 Pune, Maharashtra</Text>
                  <View style={styles.farmerStats}>
                    <Text style={styles.farmerStat}>⭐ 4.5 Rating</Text>
                    <Text style={styles.farmerStat}>📦 156 Orders</Text>
                  </View>
                </View>
                <Text style={styles.chatButton}>💬</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>

          {/* Product Details */}
          <Card variant="elevated" style={styles.detailsCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>📋 Product Details</Text>
            </Card.Header>
            <Card.Content>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{product.categoryId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Min. Order</Text>
                <Text style={styles.detailValue}>{product.minOrderQuantity} {product.unit}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Harvest Date</Text>
                <Text style={styles.detailValue}>{product.harvestDate || 'Fresh'}</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Quantity Selector */}
          <Card variant="elevated" style={styles.quantityCard}>
            <Card.Content>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity 
                  style={styles.qtyButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>₹{product.price * quantity}</Text>
        </View>
        <Button variant="primary" size="lg" onPress={addToCart} style={styles.addButton}>
          Add to Cart
        </Button>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
    backgroundColor: colors.backgroundSecondary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
  },
  productEmoji: {
    fontSize: 80,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  backText: {
    ...typography.h3,
    color: colors.text,
  },
  badge: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...typography.body,
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  productName: {
    ...typography.h2,
    color: colors.text,
  },
  productOrigin: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  unit: {
    ...typography.body,
    color: colors.textSecondary,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stockText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  stockQty: {
    ...typography.small,
    color: colors.textSecondary,
  },
  descriptionCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  farmerCard: {
    marginBottom: spacing.md,
  },
  farmerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmerAvatar: {
    backgroundColor: colors.secondaryTint,
  },
  avatarText: {
    fontSize: 24,
  },
  farmerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  farmerName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  farmerLocation: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  farmerStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  farmerStat: {
    ...typography.small,
    color: colors.textSecondary,
  },
  chatButton: {
    fontSize: 24,
    padding: spacing.sm,
  },
  detailsCard: {
    marginBottom: spacing.md,
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
  quantityCard: {
    marginBottom: spacing.md,
  },
  quantityLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    ...typography.h3,
    color: colors.primaryForeground,
  },
  quantity: {
    ...typography.h2,
    color: colors.text,
    minWidth: 60,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  totalPrice: {
    ...typography.h3,
    color: colors.text,
  },
  addButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
})
