<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { login } from '@/services/authService'
import { LoginRequestSchema, type LoginRequest } from '@/schema/auth'
import { Loader2 } from 'lucide-vue-next'
import FormError from '@/components/FormError.vue'

import lightLogoImage from '@/assets/images/logo/light-logo.png'


const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const formSchema = toTypedSchema(LoginRequestSchema)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values: LoginRequest) => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    errorMessage.value = null

    await login(values)

    // Redirect to home page on successful login
    await router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Login failed. Please try again.'
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
              class="relative hidden md:flex flex-col gap-1 items-center justify-center bg-muted dark:bg-muted/45 rounded-l-xl">
              <img :src="lightLogoImage" alt="adCentra.ai" class="w-20 h-20 mb-2" />
              <h1 class="text-2xl font-semibold">AdCentra</h1>
              <p class="text-sm text-center text-muted-foreground">Programmatic ad booking made easy.</p>
            </div>
            <form @submit="onSubmit" class="p-6 md:p-8">
              <div class="flex flex-col gap-6">
                <span class="text-2xl text-center font-semibold my-2 hidden md:block">Welcome back</span>
                <div class="flex flex-row gap-2 items-center justify-center md:hidden my-2">
                  <img :src="lightLogoImage" alt="adCentra.ai" class="w-6 h-6" />
                  <h1 class="text-xl font-semibold">AdCentra</h1>
                </div>

                <FormError :errorMessage />

                <FormField v-slot="{ componentField }" name="email">
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" :disabled="isLoading" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" :disabled="isLoading" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <Button type="submit" :disabled="isLoading"
                  :class="{ 'cursor-pointer': !isLoading, 'cursor-not-allowed': isLoading }">
                  <template v-if="isLoading">
                    <Loader2 v-if="isLoading" class="animate-spin" />
                    Signing in...
                  </template>
                  <template v-else>
                    Sign in
                  </template>
                </Button>
                <div class="text-center text-sm mt-2">
                  Don't have an account?
                  <a href="/signup" class="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div
          class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  </div>
</template>