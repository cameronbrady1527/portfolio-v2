"use client";

import { EncryptedText } from "@/components/ui/encrypted-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export function ComingSoonSection() {
    const [mounted, setMounted] = useState(false);
    const [titleComplete, setTitleComplete] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [activeParagraph, setActiveParagraph] = useState<0 | 1 | 2 | 3>(0);
    const [allParagraphsComplete, setAllParagraphsComplete] = useState(false);
    const [showCracked, setShowCracked] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleButtonClick = () => {
        setButtonClicked(true);
        setShowIndicator(true);
        setActiveParagraph(1);
    };

    const handleFinalParagraphComplete = () => {
        setAllParagraphsComplete(true);
        setShowCracked(true);
        // Hide indicator after 2 seconds
        setTimeout(() => setShowIndicator(false), 2000);
    };

    return (
        <section className="mx-auto max-w-5xl px-6 py-20">
            <CardSpotlight
                className="relative border-2 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
                radius={300}
                color="rgba(59, 130, 246, 0.08)"
            >
                {/* Decrypting indicator */}
                <AnimatePresence>
                    {showIndicator && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-4 right-4 flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-mono"
                        >
                            {!allParagraphsComplete ? (
                                <>
                                    <span>Decrypting</span>
                                    <span className="flex gap-0.2 text-base">
                                        <span className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}>.</span>
                                        <span className="animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}>.</span>
                                        <span className="animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}>.</span>
                                    </span>
                                </>
                            ) : showCracked ? (
                                <span>We cracked it!</span>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Scattered math symbols in background - playful positioning */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Plus sign - top left */}
                    <div className="absolute top-8 left-12 text-[10rem] font-bold text-blue-500/20 dark:text-blue-400/20 rotate-12">
                        +
                    </div>
                    {/* Minus sign - top right */}
                    <div className="absolute top-16 right-20 text-[8rem] font-bold text-blue-500/15 dark:text-blue-400/15 -rotate-6">
                        −
                    </div>
                    {/* Multiply - bottom left */}
                    <div className="absolute bottom-20 left-24 text-[11rem] font-bold text-blue-500/18 dark:text-blue-400/18 -rotate-12">
                        ×
                    </div>
                    {/* Divide - bottom right */}
                    <div className="absolute bottom-12 right-16 text-[9rem] font-bold text-blue-500/16 dark:text-blue-400/16 rotate-6">
                        ÷
                    </div>
                    {/* Extra small scattered symbols for fun */}
                    <div className="absolute top-1/2 right-1/4 text-[4rem] font-bold text-blue-500/10 dark:text-blue-400/10 rotate-45">
                        +
                    </div>
                    <div className="absolute top-1/3 left-1/3 text-[5rem] font-bold text-blue-500/12 dark:text-blue-400/12 -rotate-12">
                        ×
                    </div>
                </div>

                {/* Subtle dotted pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="relative z-10 space-y-6 text-center">
                    {/* Title with strong typography - reveals first */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                        {mounted ? (
                            <EncryptedText
                                text="Coming Soon: Tutor Platform!"
                                encryptedClassName="text-slate-400 dark:text-slate-600"
                                revealedClassName="text-slate-900 dark:text-slate-50"
                                revealDelayMs={25}
                                onComplete={() => setTitleComplete(true)}
                            />
                        ) : (
                            <span className="text-slate-900 dark:text-slate-50">Up Next: Complete Tutor Platform!</span>
                        )}
                    </h2>

                    {/* Decrypt Info Button - appears after title completes */}
                    {titleComplete && !buttonClicked && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex justify-center"
                        >
                            <button
                                onClick={handleButtonClick}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                Decrypt Info
                            </button>
                        </motion.div>
                    )}

                    {/* Main description - reveals sequentially after button click */}
                    <div className="text-base md:text-lg leading-relaxed space-y-5 max-w-3xl mx-auto">
                        {buttonClicked && activeParagraph >= 1 && (
                            <p>
                                <EncryptedText
                                    text="I have been finding great success with students. Scores are improving and students are loving the personalized and additional learning material I am giving them outside of the session (free of charge)! To continue improving the experience, I am building on what works, developing a platform for students and parents where they can access additional content."
                                    encryptedClassName="text-slate-400 dark:text-slate-700"
                                    revealedClassName="text-slate-700 dark:text-slate-300"
                                    revealDelayMs={12}
                                    onComplete={() => setActiveParagraph(2)}
                                />
                            </p>
                        )}

                        {/* Key features highlight - reveals after para 1 completes */}
                        {buttonClicked && activeParagraph >= 2 && (
                            <p>
                                <EncryptedText
                                    text="It will be personalized to each student's learning needs with in-house AI integration for targeted learning content and additional resource suggestions and assessment of needs. This platform will allow students to extend their learning beyond the tutoring session, and access past, present, and brand new, research-backed materials."
                                    encryptedClassName="text-slate-400 dark:text-slate-700"
                                    revealedClassName="text-slate-700 dark:text-slate-300"
                                    revealDelayMs={12}
                                    onComplete={() => setActiveParagraph(3)}
                                />
                            </p>
                        )}

                        {/* Closing statement - reveals after para 2 completes */}
                        {buttonClicked && activeParagraph >= 3 && (
                            <p className="pt-4 italic font-medium text-lg">
                                <EncryptedText
                                    text="I love teaching and cannot wait to roll out this platform for your or your loved ones' benefit."
                                    encryptedClassName="text-slate-400 dark:text-slate-700"
                                    revealedClassName="text-blue-600 dark:text-blue-400"
                                    revealDelayMs={15}
                                    onComplete={handleFinalParagraphComplete}
                                />
                            </p>
                        )}
                    </div>
                </div>
            </CardSpotlight>
        </section>
    );
}
