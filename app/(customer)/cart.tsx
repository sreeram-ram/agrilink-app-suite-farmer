import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'
import { blink } from '@/lib/blink'

interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: {
    name: string
    unit: string
    origin: string
  }
}

export default function CartScreen() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState('')
  const [deliveryNote, setDeliveryNote] = useState('')

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const items = await blink.db.cart_items.list({ limit: 20 })
      
      // Load product details for each cart item
      const itemsWithProducts = await Promise.all(
        items.map(async (item: CartItem) => {
          try {
            const product = await blink.db.products.get(item.productId)
            return { ...item, product }
          } catch {
            return item
          }
        })
      )
      setCartItems(itemsWithProducts)
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta
    if (newQty <= 0) {
      await removeItem(item.id)
    } else {
      await blink.db.cart_items.update(item.id, { quantity: newQty })
      loadCart()
    }
  }

  const removeItem = async (itemId: string) => {
    Alert.alert('Remove Item', 'Remove this item from cart?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Remove', 
        style: 'destructive',
        onPress: async () => {
          await blink.db.cart_items.delete(itemId)
          loadCart()
        }
      },
    ])
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = subtotal > 500 ? 0 : 49
  const platformFee = Math.round(subtotal * 0.02)
  const total = subtotal + deliveryFee + platformFee

  const handleCheckout = async () => {
    if (!address) {
      Alert.alert('Address Required', 'Please enter your delivery address')
      return
    }

    try {
      const orderNumber = `ORD${Date.now()}`
      
      // Create order
      const order = await blink.db.orders.create({
        id: `order_${Date.now()}`,
        orderNumber,
        userId: 'demo_user',
        status: 'pending',
        subtotal,
        deliveryFee,
        platformFee,
        total,
        deliveryAddress: address,
        deliveryNotes: deliveryNote,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
      })

      // Create order items
      for (const item of cartItems) {
        await blink.db.order_items.create({
          id: `oi_${Date.now()}_${item.id}`,
          orderId: order.id,
          productId: item.productId,
          productName: item.product?.name || 'Product',
          productUnit: item.product?.unit || 'unit',
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })
      }

      // Clear cart
      for (const item of cartItems) {
        await blink.db.cart_items.delete(item.id)
      }

      Alert.alert('Order Placed!', `Your order ${orderNumber} has been placed successfully.`, [
        { text: 'Track Order', onPress: () => router.push('/orders') }
      ])
    } catch (error) {
      console.error('Checkout error:', error)
      Alert.alert('Error', 'Failed to place order. Please try again.')
    }
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 My Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Start adding fresh produce!</Text>
          <Button variant="primary" onPress={() => router.push('/')}>
            Browse Products
          </Button>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card variant="elevated" style={styles.cartItem}>
              <View style={styles.itemContent}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product?.name || 'Product'}</Text>
                  <Text style={styles.itemOrigin}>📍 {item.product?.origin}</Text>
                  <Text style={styles.itemPrice}>₹{item.price} / {item.product?.unit || 'unit'}</Text>
                </View>
                <View style={styles.itemActions}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity 
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item, -1)}
                    >
                      <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.qtyButton}
                      onPress={() => updateQuantity(item, 1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <View style={styles.checkoutSection}>
              {/* Delivery Address */}
              <Card variant="elevated" style={styles.addressCard}>
                <Card.Header>
                  <Text style={styles.cardTitle}>📍 Delivery Address</Text>
                </Card.Header>
                <Card.Content>
                  <Input
                    placeholder="Enter your address"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    numberOfLines={2}
                  />
                  <Input
                    placeholder="Delivery notes (optional)"
                    value={deliveryNote}
                    onChangeText={setDeliveryNote}
                    style={styles.noteInput}
                  />
                </Card.Content>
              </Card>

              {/* Payment Methods */}
              <Card variant="elevated" style={styles.paymentCard}>
                <Card.Header>
                  <Text style={styles.cardTitle}>💳 Payment Method</Text>
                </Card.Header>
                <Card.Content>
                  <View style={styles.paymentOptions}>
                    <View style={[styles.paymentOption, styles.paymentOptionActive]}>
                      <Text style={styles.paymentOptionText}>💵 Cash on Delivery</Text>
                    </View>
                    <View style={styles.paymentOption}>
                      <Text style={styles.paymentOptionText}>📱 UPI</Text>
                    </View>
                    <View style={styles.paymentOption}>
                      <Text style={styles.paymentOptionText}>💳 Card</Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* Order Summary */}
              <Card variant="elevated" style={styles.summaryCard}>
                <Card.Header>
                  <Text style={styles.cardTitle}>📋 Order Summary</Text>
                </Card.Header>
                <Card.Content>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>₹{subtotal}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    <Text style={styles.summaryValue}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Platform Fee</Text>
                    <Text style={styles.summaryValue}>₹{platformFee}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{total}</Text>
                  </View>
                  {subtotal < 500 && (
                    <Text style={styles.freeDelivery}>
                      Add ₹{500 - subtotal} more for free delivery! 🎉
                    </Text>
                  )}
                </Card.Content>
                <Card.Footer>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onPress={handleCheckout}
                    style={styles.checkoutButton}
                  >
                    Place Order • ₹{total}
                  </Button>
                </Card.Footer>
              </Card>
            </View>
          }
        />
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primaryForeground,
  },
  itemCount: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.8,
  },
  list: {
    padding: spacing.md,
  },
  cartItem: {
    marginBottom: spacing.md,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.h4,
    color: colors.text,
  },
  itemOrigin: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemPrice: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  qtyButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  qtyButtonText: {
    ...typography.h4,
    color: colors.primaryForeground,
  },
  quantity: {
    ...typography.h4,
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
  itemTotal: {
    ...typography.h4,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  removeText: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
  checkoutSection: {
    marginTop: spacing.md,
  },
  addressCard: {
    marginBottom: spacing.md,
  },
  paymentCard: {
    marginBottom: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.xl,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },
  noteInput: {
    marginTop: spacing.sm,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentOption: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  paymentOptionText: {
    ...typography.small,
    color: colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    ...typography.h4,
    color: colors.text,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
  },
  freeDelivery: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  checkoutButton: {
    width: '100%',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
})
