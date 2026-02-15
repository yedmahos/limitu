import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const navigate = useNavigate();
    const { login, signup, loginWithProvider, sendOTP, loginWithOTP, loading } = useAuth();
    const [mode, setMode] = useState('signin');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [loginType, setLoginType] = useState('email'); // 'email' or 'phone'
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        name: '',
        isStudent: true
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (mode === 'signin') {
                if (loginMethod === 'otp') {
                    // OTP Login
                    if (!otp) {
                        setError('Please enter OTP');
                        return;
                    }
                    const identifier = loginType === 'email' ? formData.email : formData.phone;
                    await loginWithOTP(identifier, otp, loginType);
                    setSuccess(true);
                    setTimeout(() => navigate('/dashboard'), 1000);
                } else {
                    // Password Login
                    if (!formData.email || !formData.password) {
                        setError('Please fill in all fields');
                        return;
                    }
                    await login(formData.email, formData.password);
                    setSuccess(true);
                    setTimeout(() => navigate('/dashboard'), 1000);
                }
            } else {
                // Signup
                if (!formData.email || !formData.phone || !formData.password || !formData.name) {
                    setError('Please fill in all fields');
                    return;
                }
                // Send OTPs to both email and phone
                await sendOTP(formData.email, 'email');
                await sendOTP(formData.phone, 'phone');
                // Navigate to OTP verification
                navigate('/verify-otp', {
                    state: {
                        email: formData.email,
                        phone: formData.phone,
                        userData: formData
                    }
                });
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        }
    };

    const handleSendOTP = async () => {
        setError('');
        const identifier = loginType === 'email' ? formData.email : formData.phone;

        if (!identifier) {
            setError(`Please enter your ${loginType}`);
            return;
        }

        try {
            await sendOTP(identifier, loginType);
            setOtpSent(true);
        } catch (err) {
            setError('Failed to send OTP');
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const user = await loginWithProvider(provider);
            // Redirect to phone verification for social logins
            navigate('/verify-phone', {
                state: {
                    userData: user
                }
            });
        } catch (err) {
            setError(`${provider} login failed`);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background overflow-hidden relative">
            {/* Back Button - Top Left Corner */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
                <i className="fi fi-rr-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
                <span className="text-sm font-medium">Back to Home</span>
            </Link>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-background transition-colors duration-300">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
            </div>

            {/* Left Section (Brand) - Hidden on mobile small, visible on lg */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 relative z-10 p-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <img src="/logo.png" alt="Limit U Logo" className="w-10 h-10 object-contain" />
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Limit U</h1>
                    </div>

                    <h2 className="text-5xl font-bold leading-tight mb-6 text-foreground">
                        Build discipline. <br />
                        <span className="text-primary">
                            Spend smart.
                        </span>
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                        The first financial control platform powered by GenAI, designed specifically for students.
                    </p>

                    <div className="mt-12 flex items-center gap-4 text-sm font-medium text-muted-foreground/80">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-xs text-foreground">
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-foreground">Trusted by 5,000+ students</span>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <i className="fi fi-sr-star text-yellow-400 text-sm"></i>
                                <span>4.9/5 user rating</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Section (Auth Card) */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 relative z-10">
                {/* Mobile Brand Header */}
                <div className="lg:hidden flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="Limit U Logo" className="w-12 h-12 object-contain mb-4" />
                    <h1 className="text-3xl font-bold text-foreground">Limit U</h1>
                    <p className="text-muted-foreground">Build discipline. Spend smart.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card rounded-3xl p-1 border border-border shadow-2xl relative overflow-hidden backdrop-blur-xl bg-card/40">
                        {/* Toggle Header */}
                        <div className="relative flex p-1 bg-secondary rounded-2xl mb-6">
                            <div className="absolute inset-y-1 rounded-xl bg-background shadow-sm transition-all duration-300 ease-out border border-border"
                                style={{
                                    left: mode === 'signin' ? '4px' : '50%',
                                    width: 'calc(50% - 4px)'
                                }}
                            />
                            <button
                                onClick={() => setMode('signin')}
                                className={cn("flex-1 py-3 text-sm font-medium relative z-10 transition-colors", mode === 'signin' ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('signup')}
                                className={cn("flex-1 py-3 text-sm font-medium relative z-10 transition-colors", mode === 'signup' ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                            >
                                Sign Up
                            </button>
                        </div>



                        {/* Form Area */}
                        <div className="px-6 pb-6">
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <AnimatePresence mode="wait">
                                    {mode === 'signin' ? (
                                        <motion.div
                                            key="signin"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-3"
                                        >
                                            {/* Login Method Toggle */}
                                            <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => { setLoginMethod('password'); setOtpSent(false); setOtp(''); }}
                                                    className={cn(
                                                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                                                        loginMethod === 'password' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    Password
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setLoginMethod('otp'); setFormData(prev => ({ ...prev, password: '' })); }}
                                                    className={cn(
                                                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                                                        loginMethod === 'otp' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    OTP
                                                </button>
                                            </div>

                                            {loginMethod === 'otp' && (
                                                <div className="flex gap-2 p-1 bg-secondary/30 rounded-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setLoginType('email'); setOtpSent(false); setOtp(''); }}
                                                        className={cn(
                                                            "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all",
                                                            loginType === 'email' ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <i className="fi fi-rr-envelope mr-1"></i> Email
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setLoginType('phone'); setOtpSent(false); setOtp(''); }}
                                                        className={cn(
                                                            "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all",
                                                            loginType === 'phone' ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <i className="fi fi-rr-phone-call mr-1"></i> Phone
                                                    </button>
                                                </div>
                                            )}

                                            {loginMethod === 'password' ? (
                                                <>
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                                        <Input
                                                            name="email"
                                                            type="email"
                                                            placeholder="student@example.com"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className="bg-secondary/50 border-input focus:ring-primary h-10 text-foreground placeholder:text-muted-foreground"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between">
                                                            <label className="text-sm font-medium text-muted-foreground">Password</label>
                                                            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
                                                        </div>
                                                        <PasswordInput
                                                            name="password"
                                                            placeholder="••••••••"
                                                            value={formData.password}
                                                            onChange={handleInputChange}
                                                            className="bg-secondary/50 border-input focus:ring-primary h-10 text-foreground placeholder:text-muted-foreground"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="space-y-1.5">
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            {loginType === 'email' ? 'Email' : 'Phone Number'}
                                                        </label>
                                                        <Input
                                                            name={loginType}
                                                            type={loginType === 'email' ? 'email' : 'tel'}
                                                            placeholder={loginType === 'email' ? 'student@example.com' : '+91 98765 43210'}
                                                            value={loginType === 'email' ? formData.email : formData.phone}
                                                            onChange={handleInputChange}
                                                            className="bg-secondary/50 border-input focus:ring-primary h-10 text-foreground placeholder:text-muted-foreground"
                                                        />
                                                    </div>
                                                    {!otpSent ? (
                                                        <Button
                                                            type="button"
                                                            onClick={handleSendOTP}
                                                            className="w-full h-10"
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <i className="fi fi-rr-spinner animate-spin"></i>
                                                            ) : (
                                                                <span className="flex items-center gap-2">
                                                                    <i className="fi fi-rr-paper-plane"></i>
                                                                    Send OTP
                                                                </span>
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <div className="space-y-1.5">
                                                            <label className="text-sm font-medium text-muted-foreground">Enter OTP</label>
                                                            <Input
                                                                type="text"
                                                                placeholder="000000"
                                                                value={otp}
                                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                                className="bg-secondary/50 border-input h-10 text-center text-2xl tracking-widest"
                                                                maxLength={6}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={handleSendOTP}
                                                                className="text-xs text-primary hover:underline"
                                                            >
                                                                Resend OTP
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="signup"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-3"
                                        >
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                                <Input
                                                    name="name"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="bg-secondary/50 border-input focus:ring-primary h-10 text-foreground placeholder:text-muted-foreground"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    placeholder="student@example.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="bg-secondary/50 border-input focus:ring-primary h-10 text-foreground placeholder:text-muted-foreground"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                                <Input
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="bg-secondary/50 border-input focus:ring-primary h-10 text-foreground placeholder:text-muted-foreground"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-muted-foreground">Create Password</label>
                                                <PasswordInput
                                                    name="password"
                                                    placeholder="Create a strong password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="bg-secondary/50 border-input focus:ring-primary h-10 text-foreground placeholder:text-muted-foreground"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 pt-1">
                                                <input
                                                    type="checkbox"
                                                    name="isStudent"
                                                    checked={formData.isStudent}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 rounded border-input bg-secondary text-primary focus:ring-primary"
                                                    id="student-check"
                                                />
                                                <label htmlFor="student-check" className="text-sm text-muted-foreground">I am a student</label>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Error Display */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-2.5 rounded-lg border border-red-400/20"
                                    >
                                        <i className="fi fi-rr-exclamation text-base"></i>
                                        {error}
                                    </motion.div>
                                )}

                                {/* Social Login Options */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-semibold text-center text-muted-foreground uppercase tracking-widest mb-3">
                                        or continue with
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-10 bg-secondary/50 border-border hover:bg-secondary"
                                            onClick={() => handleSocialLogin('Google')}
                                            disabled={loading}
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-10 bg-secondary/50 border-border hover:bg-secondary"
                                            onClick={() => handleSocialLogin('Apple')}
                                            disabled={loading}
                                        >
                                            <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.08 2.3-.84 3.23-.73 1.25.13 2.18.6 2.8 1.4-2.58 1.54-2.08 6.06.49 7.15-.55 1.53-1.28 2.92-2.09 4.35H17.05zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.3 4.5-3.74 4.25z" />
                                            </svg>
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">Or with email</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full h-12 text-base font-semibold mt-4 transition-all duration-300",
                                        success ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"
                                    )}
                                    disabled={loading || success}
                                >
                                    {loading ? (
                                        <i className="fi fi-rr-spinner animate-spin text-xl"></i>
                                    ) : success ? (
                                        <motion.div
                                            initial={{ scale: 0.5 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center gap-2"
                                        >
                                            <i className="fi fi-rr-check text-xl"></i>
                                            <span>Redirecting...</span>
                                        </motion.div>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                            <i className="fi fi-rr-arrow-right text-base"></i>
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {/* Footer Links (Terms/Privacy) */}
                            {mode === 'signup' && (
                                <p className="text-xs text-center text-muted-foreground mt-6">
                                    By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
