import { cn } from '@/utils/cn';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CheckboxInput: React.FC<Props> = ({ className, ...props }) => (
  <input
    type="checkbox"
    className={cn(
      'h-[16px] w-[16px] rounded-sm border-2 border-hovered-border bg-border animation checked:bg-primary invalid:border-important hover:opacity-75 checked:hover:bg-primary focus:ring-primary checked:focus:bg-primary',
      className,
    )}
    {...props}
  />
);
