<script setup lang="ts">
import { Info, CheckCircle, AlertTriangle, X } from 'lucide-vue-next'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type: 'error' | 'success' | 'info' | 'warning'
    message: string | null
    variant?: 'default' | 'text'
  }>(),
  {
    type: 'error',
    variant: 'default',
  },
)

const classObject = computed(() => ({
  'text-destructive-foreground': props.type === 'error',
  'bg-destructive/10 border-destructive/80 border rounded-lg':
    props.type === 'error' && props.variant === 'default',
  'text-success-foreground': props.type === 'success',
  'bg-success/10 border-success/80 border rounded-lg':
    props.type === 'success' && props.variant === 'default',
  'text-info-foreground': props.type === 'info',
  'bg-info/10 border-info/80 border rounded-lg':
    props.type === 'info' && props.variant === 'default',
  'text-warning-foreground': props.type === 'warning',
  'bg-warning/10 border-warning/80 border rounded-lg':
    props.type === 'warning' && props.variant === 'default',
}))
</script>

<template>
  <div
    v-if="props.message"
    class="p-2 text-sm flex items-center justify-center gap-2"
    :class="classObject"
    :variant="props.variant"
  >
    <Info v-if="props.type === 'info'" class="w-4 h-4" />
    <CheckCircle v-if="props.type === 'success'" class="w-4 h-4" />
    <AlertTriangle v-if="props.type === 'warning'" class="w-4 h-4" />
    <X v-if="props.type === 'error'" class="w-4 h-4" />
    {{ props.message }}
  </div>
</template>
