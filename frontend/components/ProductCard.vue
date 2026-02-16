<template>
  <div class="group bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-primary-500/50 transition-all duration-300">
    <!-- Gradient Placeholder Image -->
    <div class="relative aspect-square overflow-hidden">
      <div 
        class="absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105"
        :style="{ background: gradientStyle }"
      ></div>
      <!-- Badge -->
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 bg-primary-500/90 text-white text-xs font-medium rounded">
          {{ product.attributes.badgeText || 'Research Use Only' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
        {{ product.attributes.name }}
      </h3>
      <p class="text-dark-400 text-sm mb-3 line-clamp-2">
        {{ product.attributes.shortDescription }}
      </p>

      <!-- Price Range -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-primary-400 font-semibold">
          {{ priceRange }}
        </span>
        <span class="text-dark-500 text-xs">
          {{ variantCount }} variant{{ variantCount !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <NuxtLink
          :to="`/product/${product.attributes.slug}`"
          class="flex-1 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white text-sm font-medium rounded-lg text-center transition-colors"
        >
          View Details
        </NuxtLink>
        <button
          v-if="hasActiveVariants"
          @click="handleQuickAdd"
          class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Variant } from '~/types'
import { useCartStore } from '~/stores/cart'
import { useCompliance } from '~/composables/useCompliance'
import { CURRENCY } from '~/constants'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const { requireConfirmation } = useCompliance()

// Generate a consistent gradient based on product id
const gradientStyle = computed(() => {
  const hue1 = (props.product.id * 47) % 360
  const hue2 = (hue1 + 40) % 360
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 30%) 0%, hsl(${hue2}, 60%, 20%) 100%)`
})

const activeVariants = computed(() => {
  return props.product.attributes.variants?.data.filter(v => v.attributes.active) || []
})

const hasActiveVariants = computed(() => activeVariants.value.length > 0)

const variantCount = computed(() => activeVariants.value.length)

const priceRange = computed(() => {
  if (activeVariants.value.length === 0) return 'N/A'
  
  const prices = activeVariants.value.map(v => v.attributes.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  
  if (min === max) {
    return `${CURRENCY.SYMBOL}${min.toFixed(2)}`
  }
  return `${CURRENCY.SYMBOL}${min.toFixed(2)} - ${CURRENCY.SYMBOL}${max.toFixed(2)}`
})

const handleQuickAdd = () => {
  if (!hasActiveVariants.value) return
  
  // Quick add uses the first active variant
  const variant = activeVariants.value[0]
  
  requireConfirmation(() => {
    cartStore.addItem({
      productId: props.product.id,
      variantId: variant.id,
      productName: props.product.attributes.name,
      variantName: variant.attributes.name,
      sku: variant.attributes.sku,
      unitPrice: variant.attributes.price,
    })
  })
}
</script>
