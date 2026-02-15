import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { sendOTP, resetPassword, loading } = useAuth();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
    const [method, setMethod] = useState('email'); // 'email' or 'phone'
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (!identifier) {
            setError(`Please enter your ${method}`);
            return;
        }

        try {
            await sendOTP(identifier, method);
            setStep(2);
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await resetPassword(identifier, newPassword, otp);
            setSuccess(true);
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background overflow-hidden relative items-center justify-center px-4">
            {/* Back Button */}
            <Link
                to="/auth"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
                <i className="fi fi-rr-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
                <span className="text-sm font-medium">Back to Sign In</span>
            </Link>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-background pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card rounded-3xl p-1 border border-border shadow-2xl backdrop-blur-xl bg-card/40">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fi fi-rr-lock text-xl text-primary"></i>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
                            <p className="text-muted-foreground mt-2 text-sm">
                                {step === 1 ? "Enter your details to receive a reset code." : "Create a new secure password."}
                            </p>
                        </div>

                        {/* Method Toggle (Only in Step 1) */}
                        {step === 1 && (
                            <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg mb-6">
                                <button
                                    type="button"
                                    onClick={() => { setMethod('email'); setIdentifier(''); setError(''); }}
                                    className={cn(
                                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                                        method === 'email' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <i className="fi fi-rr-envelope mr-2"></i>Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setMethod('phone'); setIdentifier(''); setError(''); }}
                                    className={cn(
                                        "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                                        method === 'phone' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <i className="fi fi-rr-phone-call mr-2"></i>Phone
                                </button>
                            </div>
                        )}

                        <form onSubmit={step === 1 ? handleSendOTP : handleReset} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground capitalize">
                                                {method === 'email' ? "Email Address" : "Phone Number"}
                                            </label>
                                            <Input
                                                type={method === 'email' ? "email" : "tel"}
                                                placeholder={method === 'email' ? "student@example.com" : "+91 98765 43210"}
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                className="bg-secondary/50 border-input h-12"
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div className="p-3 bg-secondary/30 rounded-lg text-center mb-4">
                                            <p className="text-xs text-muted-foreground">Code sent to <span className="text-foreground font-medium">{identifier}</span></p>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-xs text-primary hover:underline mt-1"
                                            >
                                                Change {method}
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Enter OTP</label>
                                            <Input
                                                type="text"
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                maxLength={6}
                                                className="bg-secondary/50 border-input h-12 text-center text-2xl tracking-widest font-mono"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">New Password</label>
                                            <PasswordInput
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="bg-secondary/50 border-input h-12"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg flex items-center gap-2"
                                >
                                    <i className="fi fi-rr-exclamation-circle"></i>
                                    {error}
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-lg text-center font-medium"
                                >
                                    Password reset successful! Redirecting...
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 text-base mt-2"
                                disabled={loading || success}
                            >
                                {loading ? (
                                    <i className="fi fi-rr-spinner animate-spin"></i>
                                ) : step === 1 ? (
                                    <>Send Reset Code <i className="fi fi-rr-paper-plane ml-2"></i></>
                                ) : (
                                    <>Reset Password <i className="fi fi-rr-check ml-2"></i></>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
