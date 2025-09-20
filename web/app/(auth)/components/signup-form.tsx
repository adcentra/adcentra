'use client';

import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(32, 'Full name must not be more than 32 characters long'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$&*])(?!.*\s).{8,72}$/, {
        message:
          'Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character (! @ # $ & *)',
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [passwordShown, setPasswordShown] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={passwordShown ? 'text' : 'password'}
                    placeholder="Password"
                    {...field}
                  />
                  {passwordShown ? (
                    <Eye
                      className="absolute right-3 top-2 h-5 w-5 cursor-pointer text-gray-500"
                      onClick={() => setPasswordShown(!passwordShown)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-3 top-2 h-5 w-5 cursor-pointer text-gray-500"
                      onClick={() => setPasswordShown(!passwordShown)}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={passwordShown ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    {...field}
                  />
                  {passwordShown ? (
                    <Eye
                      className="absolute right-3 top-2 h-5 w-5 cursor-pointer text-gray-500"
                      onClick={() => setPasswordShown(!passwordShown)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-3 top-2 h-5 w-5 cursor-pointer text-gray-500"
                      onClick={() => setPasswordShown(!passwordShown)}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Signup
        </Button>
      </form>
    </Form>
  );
}
