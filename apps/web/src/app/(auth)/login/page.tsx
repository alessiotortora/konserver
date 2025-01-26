'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { getSafeUser } from '@/lib/actions/get/get-safe-user';
import { useUserStore } from '@/store/user-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { RequestOTP, VerifyOTP } from '../actions';

const emailFormSchema = z.object({
  email: z.string().email(),
});

const otpFormSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const buttonStates = {
  idle: 'Send me a code',
  loading: <Spinner />,
  success: 'Code sent!',
  otp: 'Verify OTP',
  verifying: 'Verifying...',
  error: 'Try again',
} as const;

type ButtonState = keyof typeof buttonStates;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [hasSentCode, setHasSentCode] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const { setUser } = useUserStore();

  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: '' },
  });

  const onRequestOTP = async (data: z.infer<typeof emailFormSchema>) => {
    setError(null);
    setButtonState('loading');
    try {
      const result = await RequestOTP(data.email);
      if (result.success) {
        setButtonState('success');
        setTimeout(() => {
          setEmail(data.email);
          setHasSentCode(true);
          setStep('otp');
          setButtonState('otp');
        }, 1000);
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.');
        setButtonState('error');
      }
    } catch (error) {
      console.error(error);
      setError('An unexpected error occurred. Please try again.');
      setButtonState('error');
    }
  };

  const onVerifyOTP = async (data: z.infer<typeof otpFormSchema>) => {
    setError(null);
    setButtonState('verifying');
    try {
      const result = await VerifyOTP(email, data.otp);
      if (result.success) {
        const user = await getSafeUser();
        if (user) {
          setUser(user);
          router.push('/dashboard');
        } else {
          setError('Failed to load user data. Please try again.');
          setButtonState('otp');
        }
      } else {
        setError(result.error ?? 'Invalid code. Please try again.');
        setButtonState('otp');
      }
    } catch (error) {
      console.error(error);
      setError('An unexpected error occurred. Please try again.');
      setButtonState('otp');
    }
  };

  return (
    <div className="mx-auto flex h-dvh max-w-sm flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'email' ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full"
          >
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onRequestOTP)}
                className="flex w-full flex-col gap-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="secondary"
                  type="submit"
                  disabled={buttonState === 'loading' || buttonState === 'success'}
                >
                  {buttonStates[buttonState]}
                </Button>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onVerifyOTP)}
                className="flex w-full flex-col gap-4"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-time password</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          onComplete={otpForm.handleSubmit(onVerifyOTP)}
                        >
                          <InputOTPGroup className="mx-auto w-full flex justify-center">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <Button variant="secondary" type="submit" disabled={buttonState === 'verifying'}>
                    {buttonStates[buttonState]}
                  </Button>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setButtonState('idle');
                      setError(null);
                      otpForm.reset();
                    }}
                  >
                    Use a different email
                  </Button>
                </div>
              </form>
            </Form>
            {hasSentCode && (
              <p className="mt-4 text-sm text-muted-foreground">
                If you don&apos;t see anything after 2 minutes, I likely couldn&apos;t match the
                provided email to an account.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
