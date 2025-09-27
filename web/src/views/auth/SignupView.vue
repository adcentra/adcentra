<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { register } from '@/services/authService'
import { RegisterRequestSchema, type RegisterRequest } from '@/schema/auth'
import { Loader2 } from 'lucide-vue-next'
import FormBanner from '@/components/FormBanner.vue'

import lightLogoImage from '@/assets/images/logo/light-logo.png'
import ServiceError from '@/services/serviceError'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const { t } = useI18n()
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const formSchema = toTypedSchema(RegisterRequestSchema)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values: RegisterRequest) => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = null

    const registerResponse = await register(values)
    const authStore = useAuthStore()
    authStore.setAuth(registerResponse.user, registerResponse.authenticationToken)

    // Redirect to home page on successful login
    await router.push('/activate')
  } catch (error) {
    const serviceError = error as ServiceError
    errorMessage.value = serviceError.message
    if (serviceError.fieldErrors) {
      Object.keys(serviceError.fieldErrors).forEach((field) => {
        form.setFieldError(
          field as 'fullName' | 'email' | 'password' | 'confirmPassword',
          serviceError.fieldErrors![field],
        )
      })
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-3xl">
      <div class="flex flex-col gap-6">
        <Card class="overflow-hidde py-0">
          <CardContent class="grid p-0 md:grid-cols-2">
            <div
              class="relative hidden md:flex flex-col gap-1 items-center justify-center bg-muted dark:bg-muted/45 rounded-l-xl"
            >
              <img :src="lightLogoImage" alt="adCentra.ai" class="w-20 h-20 mb-2" />
              <h1 class="text-2xl font-semibold">AdCentra</h1>
              <p class="text-sm text-center text-muted-foreground">{{ t('brand.tagline') }}</p>
            </div>
            <form @submit="onSubmit" class="p-6 md:p-8">
              <div class="flex flex-col gap-6">
                <span class="text-2xl text-center font-semibold my-2 hidden md:block">{{
                  t('auth.createAccount')
                }}</span>
                <div class="flex flex-row gap-2 items-center justify-center md:hidden my-2">
                  <img :src="lightLogoImage" alt="adCentra.ai" class="w-6 h-6" />
                  <h1 class="text-xl font-semibold">AdCentra</h1>
                </div>

                <FormBanner :message="errorMessage" type="error" />

                <FormField v-slot="{ componentField }" name="fullName">
                  <FormItem>
                    <FormLabel>{{ t('auth.fullName') }}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        :placeholder="t('auth.fullName')"
                        :disabled="isLoading"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>{{ t('auth.email') }}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        :placeholder="t('auth.email')"
                        :disabled="isLoading"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                    <FormLabel>{{ t('auth.password') }}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        :placeholder="t('auth.password')"
                        :disabled="isLoading"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="confirmPassword">
                  <FormItem>
                    <FormLabel>{{ t('auth.confirmPassword') }}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        :placeholder="t('auth.confirmPassword')"
                        :disabled="isLoading"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <Button
                  type="submit"
                  :disabled="isLoading"
                  :class="{ 'cursor-pointer': !isLoading, 'cursor-not-allowed': isLoading }"
                >
                  <template v-if="isLoading">
                    <Loader2 v-if="isLoading" class="animate-spin" />
                    {{ t('auth.creatingAccount') }}
                  </template>
                  <template v-else>
                    {{ t('auth.signup') }}
                  </template>
                </Button>
                <div class="text-center text-sm mt-2">
                  {{ t('auth.haveAccount') }}
                  <a href="/login" class="underline underline-offset-4">
                    {{ t('auth.login') }}
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div
          class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
        >
          {{ t('auth.byClickingContinue') }} <a href="#">{{ t('auth.termsOfService') }}</a>
          {{ t('auth.and') }} <a href="#">{{ t('auth.privacyPolicy') }}</a
          >.
        </div>
      </div>
    </div>
  </div>
</template>
