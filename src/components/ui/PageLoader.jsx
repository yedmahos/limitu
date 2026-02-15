import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
            >
                {/* Animated Logo/Icon */}
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary"
                />

                {/* Loading Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-foreground font-medium"
                >
                    {message}
                </motion.p>
            </motion.div>
        </div>
    );
};
