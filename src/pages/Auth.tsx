import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { signupSchema, loginSchema } from '@/lib/validationSchemas';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: ''
  });
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Validate login data
        const validationResult = loginSchema.safeParse({
          email: formData.email,
          password: formData.password
        });

        if (!validationResult.success) {
          toast.error(validationResult.error.errors[0].message);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t('auth.loginSuccess'));
          navigate('/');
        }
      } else {
        // Validate signup data
        const validationResult = signupSchema.safeParse({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          displayName: formData.displayName
        });

        if (!validationResult.success) {
          toast.error(validationResult.error.errors[0].message);
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: formData.username,
              display_name: formData.displayName
            }
          }
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t('auth.signupSuccess'));
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast.error(t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="card-premium w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Meet
          </h1>
          <p className="text-slate-light">
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  {t('auth.username')}
                </label>
                <Input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={t('auth.usernamePlaceholder')}
                  className="input-premium"
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  {t('auth.displayName')}
                </label>
                <Input
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder={t('auth.displayNamePlaceholder')}
                  className="input-premium"
                  required={!isLogin}
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate mb-2">
              {t('auth.email')}
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('auth.emailPlaceholder')}
              className="input-premium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('auth.passwordPlaceholder')}
                className="input-premium pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-slate"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="btn-premium w-full"
            disabled={loading}
          >
            {loading ? t('auth.loading') : (isLogin ? t('auth.login') : t('auth.signup'))}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            {isLogin ? t('auth.needAccount') : t('auth.haveAccount')}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;