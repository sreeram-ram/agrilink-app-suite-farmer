import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design'
import { blink } from '@/lib/blink'

export default function FarmerInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await blink.db.products.list({ limit: 50 })
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (product: any) => {
    const newStatus = product.isAvailable === '1' ? '0' : '1'
    await blink.db.products.update(product.id, { isAvailable: newStatus })
    loadProducts()
  }

  const deleteProduct = (productId: string) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          // Note: Need to implement delete in SDK
          loadProducts()
        }
      },
    ])
  }

  const renderProduct = ({ item }: { item: any }) => (
    <Card variant="elevated" style={styles.productCard}>
      <View style={styles.productContent}>
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{item.name}</Text>
            {item.isOrganic === '1' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🌿 Organic</Text>
              </View>
            )}
          </View>
          <Text style={styles.productDesc}>{item.description}</Text>
          <View style={styles.productMeta}>
            <Text style={styles.metaText}>📦 Stock: {item.stockQuantity} {item.unit}</Text>
            <Text style={styles.metaText}>📍 {item.origin}</Text>
          </View>
        </View>
        <View style={styles.productActions}>
          <Text style={styles.productPrice}>₹{item.price}/{item.unit}</Text>
          <TouchableOpacity
            style={[
              styles.availabilityToggle,
              item.isAvailable === '1' ? styles.available : styles.unavailable
            ]}
            onPress={() => toggleAvailability(item)}
          >
            <Text style={[
              styles.toggleText,
              item.isAvailable === '1' ? styles.availableText : styles.unavailableText
            ]}>
              {item.isAvailable === '1' ? 'Available' : 'Unavailable'}
            </Text>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => { setEditingProduct(item); setShowAddModal(true) }}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteProduct(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>📦 Inventory</Text>
          <Text style={styles.headerSubtitle}>{products.length} products</Text>
        </View>
        <Button variant="primary" onPress={() => setShowAddModal(true)}>
          + Add Product
        </Button>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterText}>In Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterText}>Out of Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterText}>Organic</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Button variant="primary" onPress={() => setShowAddModal(true)}>
              Add Your First Product
            </Button>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Add/Edit Product Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity onPress={() => { setShowAddModal(false); setEditingProduct(null) }}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Input label="Product Name" placeholder="e.g., Organic Tomatoes" />
              <Input label="Description" placeholder="Product description" multiline />
              <View style={styles.row}>
                <Input label="Price (₹)" placeholder="45" keyboardType="numeric" style={styles.halfInput} />
                <Input label="Unit" placeholder="kg" style={styles.halfInput} />
              </View>
              <View style={styles.row}>
                <Input label="Stock Quantity" placeholder="100" keyboardType="numeric" style={styles.halfInput} />
                <Input label="Origin" placeholder="Maharashtra" style={styles.halfInput} />
              </View>
              <View style={styles.checkboxRow}>
                <TouchableOpacity style={styles.checkbox}>
                  <Text style={styles.checkboxText}>🌿 Organic</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.checkbox}>
                  <Text style={styles.checkboxText}>🍎 Seasonal</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Button variant="outline" onPress={() => { setShowAddModal(false); setEditingProduct(null) }}>
                Cancel
              </Button>
              <Button variant="primary" onPress={() => { setShowAddModal(false); loadProducts() }}>
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
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
  headerSubtitle: {
    ...typography.body,
    color: colors.primaryForeground,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  filters: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.full,
  },
  filterChipActive: {
    backgroundColor: colors.secondary,
  },
  filterText: {
    ...typography.small,
    color: colors.text,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
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
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  productName: {
    ...typography.h4,
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  badgeText: {
    ...typography.tiny,
    color: colors.primary,
  },
  productDesc: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  productMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  productActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  productPrice: {
    ...typography.h4,
    color: colors.primary,
  },
  availabilityToggle: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  available: {
    backgroundColor: colors.secondaryTint,
  },
  unavailable: {
    backgroundColor: colors.backgroundSecondary,
  },
  toggleText: {
    ...typography.small,
    fontWeight: '600',
  },
  availableText: {
    color: colors.secondary,
  },
  unavailableText: {
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  editButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  editButtonText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  deleteButtonText: {
    ...typography.small,
    color: colors.error,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text,
  },
  closeButton: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  modalBody: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    ...typography.body,
    color: colors.text,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
})
