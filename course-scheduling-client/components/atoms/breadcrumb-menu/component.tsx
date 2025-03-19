import { cn } from '@/utils/cn';

interface Props extends React.HTMLAttributes<HTMLMenuElement> {
  children?: React.ReactNode;
}

export const BreadcrumbMenu: React.FC<Props> = ({
  children,
  className,
  ...props
}) => (
  <menu
    className={cn(
      'flex gap-sm [&_a]:text-neutral [&_li+li]:before:pr-sm [&_li+li]:before:text-neutral [&_li+li]:before:content-["/"]',
      className,
    )}
    {...props}
  >
    {children}
  </menu>
);
