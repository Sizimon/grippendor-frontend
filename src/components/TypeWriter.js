import { motion } from 'framer-motion';

const LETTER_DELAY = 0.05;
const BOX_FADE_DURATION = 0.1;

const Typewriter = ({ header }) => {
  if (!header) {
    return null;
  }

  const words = header.split(' '); // Split header into words
  let cumulativeDelay = 0; // Initialize cumulative delay

  return (
    <h2 className='text-start'>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className='inline-block mr-1'>
          {word.split('').map((letter, letterIndex) => {
            const delay = cumulativeDelay * LETTER_DELAY;
            cumulativeDelay += 1; // Increment cumulative delay for each letter
            return (
              <motion.span
                key={letterIndex}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  delay: delay,
                  duration: BOX_FADE_DURATION,
                  ease: 'easeInOut',
                }}
                className='relative'
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    delay: delay,
                    times: [0, 1, 1],
                    duration: BOX_FADE_DURATION,
                    ease: 'easeInOut',
                  }}
                  className='absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-white'
                />
                {letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
};

export default Typewriter;