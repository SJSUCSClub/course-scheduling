import { cn } from '@/utils/cn';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
}

export const Select: React.FC<Props> = ({ children, className, ...props }) => (
  <select
    className={cn(
      'rounded-md border-2 border-hovered-border bg-border py-sm pl-md pr-xl text-text animation invalid:border-important focus:border-primary focus:outline-none focus:outline-primary focus:ring-0 focus:ring-primary',
      className,
    )}
    {...props}
  >
    {children}
  </select>
);
