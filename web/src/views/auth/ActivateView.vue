<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { activateAccount, logout, requestActivationToken } from '@/services/authService'
import { ActivateAccountRequestSchema, type ActivateAccountRequest } from '@/schema/auth'
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-vue-next'
import FormBanner from '@/components/FormBanner.vue'

import ServiceError from '@/services/serviceError'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/authStore'
import EmailDialog from '@/components/EmailDialog.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const isActivated = ref(false)
const authStore = useAuthStore()
const tokenSent = ref(true)
const isDialogOpen = ref(false)

const formSchema = toTypedSchema(ActivateAccountRequestSchema)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    token: (route.query.token as string) || '',
  },
})

const requestNewActivationToken = async (email?: string) => {
  if (isLoading.value) return

  if (!email) {
    isDialogOpen.value = true
    return
  }

  try {
    isLoading.value = true
    tokenSent.value = false
    errorMessage.value = null
    successMessage.value = null

    successMessage.value = await requestActivationToken(email)
    toast.info(t('auth.sentNewActivationToken'))
    tokenSent.value = true
  } catch (error) {
    const serviceError = error as ServiceError
    errorMessage.value = serviceError.message

    if (serviceError.fieldErrors) {
      errorMessage.value = serviceError.fieldErrors!.email
    }
  } finally {
    isLoading.value = false
  }
}

const onLogout = async () => {
  try {
    await logout()
  } catch {
    // Ignore error and proceed to logout
  } finally {
    authStore.clearAuth()
    router.push('/login')
  }
}

const onSubmit = form.handleSubmit(async (values: ActivateAccountRequest) => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = null
    successMessage.value = null

    await activateAccount(values.token)
    isActivated.value = true
    successMessage.value = t('auth.accountActivated')
    authStore.updateUser({ activated: true })
  } catch (error) {
    const serviceError = error as ServiceError
    errorMessage.value = serviceError.message
    if (serviceError.fieldErrors) {
      Object.keys(serviceError.fieldErrors).forEach((field) => {
        form.setFieldError(field as 'token', serviceError.fieldErrors![field])
      })
    }
  } finally {
    isLoading.value = false
  }
})

const goToDashboard = () => {
  router.push('/login')
}

// Auto-activate if token is provided in URL
onMounted(async () => {
  const tokenFromUrl = route.query.token as string
  if (tokenFromUrl) {
    form.setFieldValue('token', tokenFromUrl)
    await onSubmit()
  }
})
</script>

<template>
  <EmailDialog
    v-model:isDialogOpen="isDialogOpen"
    :title="t('auth.enterEmail')"
    :message="t('auth.WillSendActivationToken')"
    :onSubmit="requestNewActivationToken"
  />
  <div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    <div class="w-xs sm:w-sm md:w-md lg:w-lg max-w-sm md:max-w-3xl">
      <div class="flex flex-col gap-6">
        <Card class="overflow-hidden py-10">
          <CardContent class="w-full">
            <div class="px-6 md:px-8">
              <div class="flex flex-col gap-8">
                <span class="text-xl md:text-2xl text-center font-semibold mb-2">{{
                  t('auth.activateAccount')
                }}</span>

                <!-- Success State -->
                <div v-if="isActivated && successMessage" class="text-center space-y-4">
                  <div class="flex justify-center">
                    <CheckCircle class="w-12 h-12 text-success" />
                  </div>
                  <div>
                    <h2 class="text-lg font-normal text-success mb-6">
                      {{ t('auth.accountActivated') }}
                    </h2>
                    <Button @click="goToDashboard" class="w-full">
                      {{
                        authStore.isAuthenticated ? t('auth.proceedToDashboard') : t('auth.login')
                      }}
                    </Button>
                  </div>
                </div>
                <!-- Form State -->
                <form v-else @submit="onSubmit" class="space-y-6">
                  <FormBanner v-if="errorMessage" type="error" :message="errorMessage" />
                  <FormBanner
                    v-else-if="tokenSent"
                    type="info"
                    :message="t('auth.checkEmailForActivation')"
                  />

                  <FormField v-slot="{ componentField }" name="token">
                    <FormItem class="my-6">
                      <FormLabel>{{ t('auth.activationToken') }}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          :placeholder="t('auth.activationToken')"
                          :disabled="isLoading"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <div class="flex flex-row gap-2">
                    <Button
                      v-if="authStore.isAuthenticated"
                      variant="secondary"
                      @click="onLogout"
                      class="flex-1"
                    >
                      <ArrowLeft class="w-4 h-4" />
                      {{ t('auth.logout') }}
                    </Button>
                    <Button
                      type="submit"
                      :disabled="isLoading"
                      :class="{ 'cursor-pointer': !isLoading, 'cursor-not-allowed': isLoading }"
                      class="flex-2"
                    >
                      <template v-if="isLoading">
                        <Loader2 class="animate-spin mr-2" />
                        {{ t('auth.activatingAccount') }}
                      </template>
                      <template v-else>
                        {{ t('auth.activate') }}
                      </template>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            <div v-if="!isActivated" class="w-full mt-6 text-center text-sm text-muted-foreground">
              {{ t('auth.didNotReceiveActivationToken') }}
              <a
                @click="requestNewActivationToken(authStore.user?.email)"
                href="#"
                class="text-center text-sm text-primary underline cursor-pointer"
                >{{ t('auth.requestNewActivationToken') }}</a
              >
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
