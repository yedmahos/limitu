import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOTP } = useAuth();

    const [emailOTP, setEmailOTP] = useState('');
    const [phoneOTP, setPhoneOTP] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);

    const email = location.state?.email || '';
    const phone = location.state?.phone || '';

    useEffect(() => {
        if (!email || !phone) {
            navigate('/auth');
            return;
        }

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [email, phone, navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        if (!emailOTP || !phoneOTP) {
            setError('Please enter both OTP codes');
            return;
        }

        if (emailOTP.length !== 6 || phoneOTP.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(email, emailOTP, phone, phoneOTP);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid OTP codes');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        // Mock resend - in real app, this would call backend
        console.log('Resending OTP to:', email, phone);
        setCountdown(300);
        setCanResend(false);
        setError('');

        // Restart countdown
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Back Button - Top Left Corner */}
            <Link
                to="/auth"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
                <i className="fi fi-rr-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
                <span className="text-sm font-medium">Back to Sign In</span>
            </Link>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-6 relative z-10"
            >
                <div className="glass-card rounded-3xl p-8 border border-border shadow-2xl backdrop-blur-xl bg-card/40">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <i className="fi fi-rr-shield-check text-3xl text-primary"></i>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Verify Your Account</h1>
                        <p className="text-muted-foreground text-sm">
                            We've sent verification codes to your email and phone
                        </p>
                    </div>

                    {/* Contact Info Display */}
                    <div className="bg-secondary/30 rounded-xl p-4 mb-6 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <i className="fi fi-rr-envelope text-primary"></i>
                            <span className="text-muted-foreground">{email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <i className="fi fi-rr-phone-call text-primary"></i>
                            <span className="text-muted-foreground">{phone}</span>
                        </div>
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <i className="fi fi-rr-envelope text-base"></i>
                                Email OTP
                            </label>
                            <Input
                                type="text"
                                placeholder="000000"
                                value={emailOTP}
                                onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="bg-secondary/50 border-input h-12 text-center text-2xl tracking-widest"
                                maxLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <i className="fi fi-rr-phone-call text-base"></i>
                                Phone OTP
                            </label>
                            <Input
                                type="text"
                                placeholder="000000"
                                value={phoneOTP}
                                onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="bg-secondary/50 border-input h-12 text-center text-2xl tracking-widest"
                                maxLength={6}
                            />
                        </div>

                        {/* Error Display */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                            >
                                <i className="fi fi-rr-exclamation text-base"></i>
                                {error}
                            </motion.div>
                        )}

                        {/* Timer */}
                        <div className="text-center">
                            {countdown > 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Code expires in <span className="font-bold text-primary">{formatTime(countdown)}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-red-400">OTP expired</p>
                            )}
                        </div>

                        {/* Verify Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full"
                            disabled={loading || countdown === 0}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <i className="fi fi-rr-spinner text-base animate-spin"></i>
                                    Verifying...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Verify & Continue
                                    <i className="fi fi-rr-arrow-right text-base"></i>
                                </span>
                            )}
                        </Button>

                        {/* Resend OTP */}
                        <div className="text-center">
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive codes? Wait for timer to resend
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default OTPVerification;
