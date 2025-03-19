import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
  children?: React.ReactNode;
}

export const Btn: React.FC<Props> = ({
  variant,
  children,
  className,
  ...props
}) => (
  <button
    className={cn(
      'flex items-center gap-xs rounded-lg px-md py-sm text-button animation focus:outline-none focus:ring-2 focus:ring-offset-2 enabled:hover:opacity-50 enabled:active:opacity-25 disabled:text-neutral',
      {
        'border-2 border-border bg-primary text-background focus:ring-primary disabled:bg-border dark:bg-background dark:text-text':
          variant === 'primary',
        'border-2 border-border bg-secondary text-background focus:ring-secondary disabled:bg-border dark:text-text':
          variant === 'secondary',
        'text-primary focus:ring-primary dark:text-text dark:focus:ring-border':
          variant === 'tertiary',
        'border-2 border-primary text-primary focus:ring-primary disabled:border-neutral dark:border-border dark:text-text':
          variant === 'ghost',
      },
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
