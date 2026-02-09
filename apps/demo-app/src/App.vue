<script setup lang="ts">
import { VERSION } from '@filament-ts/support'
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Filament TypeScript Demo App
        </h1>
        <p class="text-gray-600 mb-6">
          Welcome to the Filament TypeScript demo application.
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p class="text-sm text-blue-800">
            <strong>Support Package Version:</strong> {{ VERSION }}
          </p>
        </div>
        <p class="mt-6 text-sm text-gray-500">
          More content coming soon...
        </p>
      </div>
    </div>
  </div>
</template>
