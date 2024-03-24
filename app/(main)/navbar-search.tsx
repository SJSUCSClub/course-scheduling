import clsx from 'clsx';

import Icon from '@/components/icon';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NavbarSearch: React.FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={clsx(
        `-:flex -:h-[40px] -:text-body -:text-text`,
        props.className,
      )}
    >
      <input
        type="text"
        className="h-full w-0 flex-1 rounded-l-md bg-border pr-10 animation default-border focus:border-primary focus:ring-0"
        placeholder="Search"
      />
      <div className="relative h-full">
        <div className="absolute right-4 flex h-full w-[16px] items-center">
          <Icon icon={<MagnifyingGlassIcon />} w="16px" h="16px" />
        </div>
      </div>
      <select className="flex h-full w-fit appearance-none items-center rounded-r-md bg-background py-[5px] pl-[16px] pr-[38px] animation default-border focus:border-primary focus:ring-0">
        <option value="courses">Courses</option>
        <option value="professors">Professors</option>
      </select>
    </div>
  );
};

export default NavbarSearch;
