import { cn } from '@/utils/cn';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children, className, ...props }) => (
  <div
    className={cn(
      'overflow-clip rounded-lg border-2 border-border bg-background',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
