import { cn } from '@/utils/cn';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const TextInput: React.FC<Props> = ({ className, ...props }) => (
  <input
    type="text"
    className={cn(
      'rounded-md border-2 border-hovered-border bg-border px-md py-sm text-text animation placeholder:text-neutral invalid:border-important focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:text-neutral',
      className,
    )}
    {...props}
  />
);
