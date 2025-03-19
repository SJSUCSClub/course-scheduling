import { Card } from '@/components/atoms';
import { EvaluationType } from '@/types';
import { cn } from '@/utils/cn';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: EvaluationType;
  children?: React.ReactNode;
}

export const StatCard: React.FC<Props> = ({
  variant,
  children,
  className,
  ...props
}) => (
  <Card
    className={cn(
      {
        'bg-[rgb(var(--color-good)/0.75)] text-[color-mix(in_srgb,rgb(var(--color-good))_50%,black_50%)]':
          variant === 'good',
        'bg-[rgb(var(--color-ok)/0.75)] text-[color-mix(in_srgb,rgb(var(--color-ok))_50%,black_50%)]':
          variant === 'ok',
        'bg-[rgb(var(--color-bad)/0.75)] text-[color-mix(in_srgb,rgb(var(--color-bad))_50%,black_50%)]':
          variant === 'bad',
        'bg-[rgb(var(--color-neutral)/0.75)] text-[color-mix(in_srgb,rgb(var(--color-neutral))_50%,black_50%)]':
          !variant,
      },
      className,
    )}
    {...props}
  >
    {children}
  </Card>
);
