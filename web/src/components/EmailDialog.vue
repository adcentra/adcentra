<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import z from 'zod'
import FormBanner from './FormBanner.vue'

const { t } = useI18n()

const props = defineProps<{
  isDialogOpen: boolean
  title: string
  message: string
  onSubmit: (email: string) => void
}>()

const emits = defineEmits<{
  (e: 'update:isDialogOpen', value: boolean): void
}>()

const emailSchema = z.string().email(t('errors.invalidEmailAddress'))
const email = ref('')
const errorMessage = ref<string | null>(null)

const onSubmit = () => {
  if (email.value === '') {
    errorMessage.value = t('errors.emailRequired')
    return
  }
  try {
    emailSchema.parse(email.value)
  } catch {
    errorMessage.value = t('errors.invalidEmailAddress')
    return
  }
  emits('update:isDialogOpen', false)
  errorMessage.value = null
  props.onSubmit(email.value)
}
</script>

<template>
  <Dialog :open="props.isDialogOpen" @update:open="emits('update:isDialogOpen', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription>
          {{ props.message }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <Input
          @input="errorMessage = null"
          id="email"
          v-model="email"
          :class="{ 'border-destructive': errorMessage }"
          :placeholder="t('auth.email')"
        />
        <FormBanner
          class="p-0 text-left justify-start"
          variant="text"
          v-if="errorMessage"
          type="error"
          :message="errorMessage"
        />
      </div>
      <DialogFooter>
        <Button type="submit" @click="onSubmit"> Send token </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
