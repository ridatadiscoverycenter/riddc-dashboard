import styles from './Loading.module.css';

export function Loading() {
  return (
    <div
      aria-hidden
      className={`rounded-full h-16 w-16 border-8 border-white/50 border-solid border-t-teal-400 ${styles.spinner}`}
    />
  );
}
