"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface GuideProps {
  message: string;
  imageSrc?: string;
  onComplete?: () => void;
}

/**
 * Remove sentence-ending pauses caused by TTS engines
 */
const normalizeForSpeech = (text: string) => {
  return text
    .replace(/\. /g, ", ")
    .replace(/\.$/g, ",")
    .replace(/! /g, ", ")
    .replace(/\? /g, ", ");
};

/**
 * Detect mobile devices
 */
const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const Guide = ({ message, imageSrc, onComplete }: GuideProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const hasSpoken = useRef(false);

  const speakMessage = (text: string) => {
    // ❌ Disable voice on mobile
    if (isMobileDevice()) return;

    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const cleanedText = normalizeForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    const voices = window.speechSynthesis.getVoices();

    utterance.voice =
      voices.find((v) => v.name.includes("David")) ||
      voices.find((v) => v.name.includes("Daniel")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      null;

    utterance.rate = 1.25;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    hasSpoken.current = false;

    const speechTimeout = setTimeout(() => {
      if (!hasSpoken.current) {
        speakMessage(message);
        hasSpoken.current = true;
      }
    }, 10);

    let currentLength = 0;
    let typingInterval: NodeJS.Timeout;

    const textStartTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        if (currentLength < message.length) {
          currentLength++;
          setDisplayedText(message.slice(0, currentLength));
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 25);
    }, 500);

    return () => {
      clearTimeout(speechTimeout);
      clearTimeout(textStartTimeout);
      if (typingInterval) clearInterval(typingInterval);
      window.speechSynthesis.cancel();
    };
  }, [message, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-4 z-50 flex items-start gap-3 max-w-sm sm:max-w-md pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="shrink-0"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Guide"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/20 shadow-xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-500 border-2 border-white/20 shadow-xl" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="relative bg-white text-black px-5 py-4 rounded-xl shadow-2xl mt-2"
      >
        <div className="absolute -left-2 top-6 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />

        <p className="text-sm sm:text-base font-medium leading-snug min-w-[200px]">
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-4 ml-1 align-middle bg-zinc-800"
            />
          )}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Guide;
