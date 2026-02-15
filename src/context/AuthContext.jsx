import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);
        if (error) throw error;
        return data.user;
    };

    const loginWithProvider = async (provider) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider.toLowerCase(),
        });

        // Note: OAuth sign-in usually redirects, so loading state might not need to be reset here immediately
        // but for safety in case of instant failure:
        if (error) {
            setLoading(false);
            throw error;
        }
        return data; // Will redirect
    };

    const signup = async (userData) => {
        setLoading(true);
        const { email, password, name } = userData;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    // Add other metadata here
                },
            },
        });

        setLoading(false);
        if (error) throw error;
        return data.user;
    };

    const updateProfile = async (updates) => {
        setLoading(true);
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });

        setLoading(false);
        if (error) throw error;
        return data.user;
    };

    const sendOTP = async (identifier, type = 'phone') => {
        setLoading(true);
        let error;

        if (type === 'phone') {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                phone: identifier,
            });
            error = otpError;
        } else {
            // For email (magic link/otp)
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: identifier,
            });
            error = otpError;
        }

        setLoading(false);
        if (error) throw error;
        return { success: true };
    };

    const verifyOTP = async (type, identifier, token) => {
        setLoading(true);
        const { data, error } = await supabase.auth.verifyOtp({
            [type]: identifier,
            token,
            type: type === 'phone' ? 'sms' : 'email',
        });

        setLoading(false);
        if (error) throw error;
        return data.user;
    };

    // Helper compatibility wrapper if needed for existing calls that passed 4 args
    // Original: verifyOTP(email, emailOTP, phone, phoneOTP)
    // New Supabase: verify one at a time. The UI should likely verify them sequentially or one by one.
    // For now, let's keep a flexible verify wrapper but we'll need to update usage in PhoneVerification.

    // Legacy support wrapper or specialized OTP verify
    const verifyUserOTP = async ({ phone, token, email, type = 'sms' }) => {
        setLoading(true);
        const verifyParams = {
            token,
            type
        };
        if (phone) verifyParams.phone = phone;
        if (email) verifyParams.email = email;

        const { data, error } = await supabase.auth.verifyOtp(verifyParams);

        setLoading(false);
        if (error) throw error;
        return data.user;
    }

    const loginWithOTP = async (identifier, otp, type = 'email') => {
        // This is essentially verifyOTP
        return verifyUserOTP({ [type]: identifier, token: otp, type: type === 'phone' ? 'sms' : 'email' });
    };

    const resetPassword = async (email) => {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password',
        });
        setLoading(false);
        if (error) throw error;
        return { success: true };
    };

    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            loginWithProvider,
            loginWithOTP,
            sendOTP,
            verifyOTP: verifyUserOTP, // Expose the flexible one
            resetPassword,
            updateProfile,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
