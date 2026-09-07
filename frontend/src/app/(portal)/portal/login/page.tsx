'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Scale, Phone, KeyRound, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PortalLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 7) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.portal.sendOtp(phone, email || undefined);
      setDevOtp(res.data?.devOtp || '123456');
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.portal.verifyOtp(phone, otp);
      if (res.data?.ok) {
        localStorage.setItem('auth_token', res.data.token);
        router.push('/portal');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-border/40 shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="space-y-3 text-center pb-6 border-b border-border/30">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Client Portal</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Secure, passwordless access to your legal consultations and documents
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Sending OTP...' : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Protected with 256-bit encryption</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verification code sent to <strong>{phone}</strong></span>
              </div>

              {devOtp && (
                <div className="p-2.5 rounded bg-muted/60 text-xs font-mono text-center border">
                  Demo Test Code: <span className="font-bold text-primary">{devOtp}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-Digit Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-9 font-mono tracking-widest text-center text-lg h-11"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Access Portal'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-xs text-center text-muted-foreground hover:text-foreground pt-2 underline"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
