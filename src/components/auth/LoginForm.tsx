'use client';

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { login } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateLoginForm } from '@/utils/validation';
import type { LoginCredentials } from '@/types/auth';
import { Building2, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validationErrors = validateLoginForm(formData);
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result?.token) {
        // Small delay to ensure cookie is set before navigation
        setTimeout(() => {
          router.push('/employees');
        }, 100);
      }
    } catch (err) {
      const message = typeof err === 'string' ? err : 'Login failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Building2 className="w-10 h-10 text-primary-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold ">Employee Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your employees</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@test.com"
              required
              autoComplete="email"
              autoFocus
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md animate-fade-in">
                <p className="text-sm text-red-600 font-medium">{errors.general}</p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              <span className="font-semibold text-gray-700">Demo Credentials:</span><br />
              Email: admin@test.com<br />
              Password: Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
