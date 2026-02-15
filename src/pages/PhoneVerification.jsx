import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const PhoneVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { sendOTP, verifyOTP, updateProfile } = useAuth(); // Added verifyOTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const userData = location.state?.userData;

    React.useEffect(() => {
        if (!userData) {
            navigate('/auth');
        }
    }, [userData, navigate]);

    const handleSendOTP = async () => {
        setError('');

        if (!phone) {
            setError('Please enter your phone number');
            return;
        }

        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            await sendOTP(phone, 'phone');
            setOtpSent(true);
        } catch (err) {
            setError('Failed to send OTP: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp) {
            setError('Please enter the OTP');
            return;
        }

        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        setLoading(true);
        try {
            // Verify OTP via Supabase (through AuthContext)
            await verifyOTP({
                phone,
                token: otp,
                type: 'sms'
            });

            // Update user profile with phone number if needed, 
            // though Supabase might have already linked the phone number to the user 
            // depending on if they are already logged in or if this is a new signup flow.
            // Assuming we still want to update other profile fields or just confirm verification:
            await updateProfile({ phone, verified: true });

            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
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
                            <i className="fi fi-rr-phone-call text-3xl text-primary"></i>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Verify Phone Number</h1>
                        <p className="text-muted-foreground text-sm">
                            Add your phone number to complete your account setup
                        </p>
                    </div>

                    {/* User Info Display */}
                    {userData && (
                        <div className="bg-secondary/30 rounded-xl p-4 mb-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fi fi-rr-user text-primary"></i>
                                <span className="text-muted-foreground">{userData.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="fi fi-rr-envelope text-primary"></i>
                                <span className="text-muted-foreground">{userData.email}</span>
                            </div>
                        </div>
                    )}

                    {/* Phone Verification Form */}
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <i className="fi fi-rr-phone-call text-base"></i>
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="bg-secondary/50 border-input h-12"
                                disabled={otpSent}
                            />
                        </div>

                        {!otpSent ? (
                            <Button
                                type="button"
                                onClick={handleSendOTP}
                                className="w-full h-12 rounded-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <i className="fi fi-rr-spinner text-base animate-spin"></i>
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <i className="fi fi-rr-paper-plane"></i>
                                        Send OTP
                                    </span>
                                )}
                            </Button>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Enter OTP
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="bg-secondary/50 border-input h-12 text-center text-2xl tracking-widest"
                                        maxLength={6}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-full"
                                    disabled={loading}
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

                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    className="text-sm text-primary hover:underline w-full text-center"
                                >
                                    Resend OTP
                                </button>
                            </>
                        )}

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
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default PhoneVerification;
