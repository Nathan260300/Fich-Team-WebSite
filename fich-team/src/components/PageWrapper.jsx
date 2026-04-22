import { motion } from 'framer-motion';
import styles from './PageWrapper.module.css';

const variants = {
  hidden:  { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0, y: -14, filter: 'blur(2px)',
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] }
  },
};

export default function PageWrapper({ children }) {
  return (
    <motion.main
      className={styles.main}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.main>
  );
}
