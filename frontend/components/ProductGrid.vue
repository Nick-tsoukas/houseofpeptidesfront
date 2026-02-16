<template>
  <section id="products" class="py-16 bg-dark-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Our Products
        </h2>
        <p class="text-dark-400 max-w-2xl mx-auto">
          Browse our selection of research-grade peptides. All products are for qualified professionals only.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-dark-800 rounded-xl overflow-hidden animate-pulse">
          <div class="aspect-square bg-dark-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-5 bg-dark-700 rounded w-3/4"></div>
            <div class="h-4 bg-dark-700 rounded w-full"></div>
            <div class="h-4 bg-dark-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-dark-400">No products available at this time.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

defineProps<{
  products: Product[]
  loading?: boolean
}>()
</script>
