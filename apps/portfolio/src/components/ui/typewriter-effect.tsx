"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { div } from "motion/react-client";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split("")
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content"
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut"
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `opacity-0 hidden`,
                    word.className || "text-slate-800"
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.8,
          delay: wordsArray.length * 0.1 + 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className={cn(
          "inline-block rounded-sm w-1 h-4 md:h-6 lg:h-10 bg-blue-500 ml-1 align-middle",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
}

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(word.className || "text-slate-800")}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };
 
  return (
    <div className={cn("my-6", className)}>
      <div className="text-xs sm:text-base md:text-xl lg:text-3xl xl:text-5xl font-bold">
        <motion.div
          className="overflow-hidden"
          initial={{
            maxHeight: "0px",
            opacity: 0,
          }}
          whileInView={{
            maxHeight: "500px",
            opacity: 1,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            delay: 0.5,
          }}
          viewport={{ once: true }}
        >
          <div className="inline-block max-w-full" style={{ wordWrap: "break-word" }}>
            {renderWords()}{" "}
          </div>
        </motion.div>
        <motion.span
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 2.0,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block rounded-sm w-1 h-4 sm:h-6 xl:h-12 bg-blue-500 ml-1 align-middle",
            cursorClassName
          )}
        ></motion.span>
      </div>
    </div>
  );
};