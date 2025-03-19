import { Card, LinkBtn } from '@/components/atoms';
import { CalendarDaysIcon } from '@heroicons/react/16/solid';

interface Props {
  link: string;
  subtitle: string;
  title: string;
  details?: string[];
  dates: string;
  times: string;
  location: string;
  modeOfInstruction: string;
  days: string;
}

function processDaysString(inputString: string): string[] {
  // Remove all spaces from the string
  const noSpaces = inputString.replace(/\s+/g, '');
  // Remove all occurrences of 'TBA'
  const withoutTBA = noSpaces.replace(/TBA/g, '');
  // Split the string into an array of letters
  const lettersArray = withoutTBA.split('');
  return lettersArray;
}

export const Schedule: React.FC<Props> = (props) => (
  <LinkBtn
    variant="tertiary"
    className="rounded-lg p-0 text-inherit"
    href={props.title !== 'TBA' ? props.link : '#'}
  >
    <Card className="flex w-full flex-col gap-sm max-lg:p-sm lg:p-lg">
      <div className="flex max-lg:flex-col max-lg:items-center max-lg:gap-sm max-lg:p-sm lg:items-start lg:justify-between lg:gap-md">
        <div className="flex flex-col max-lg:items-center">
          <p className="text-small-lg text-neutral max-lg:text-center">
            {props.subtitle}
          </p>
          <p className="text-p font-bold max-lg:text-center">{props.title}</p>
          {props.details ? (
            <p className="text-small-sm text-neutral max-lg:text-center">
              {props.details.map((detail, i) =>
                detail.length > 0 ? (i === 0 ? detail : ` • ${detail}`) : '',
              )}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-sm text-neutral">
          <CalendarDaysIcon width={16} height={16} />
          <p className="text-right text-small-lg">
            {props.dates.split('-').join(' - ')}
          </p>
        </div>
      </div>
      <div className="flex max-lg:flex-col max-lg:items-center max-lg:gap-xs max-lg:rounded-md max-lg:bg-border max-lg:p-md lg:items-end lg:justify-between lg:gap-md">
        <div className="flex flex-wrap gap-xs">
          {processDaysString(props.days).map((day, i) => (
            <span
              key={i}
              className="flex h-lg w-lg items-center justify-center rounded-sm bg-text text-small-lg font-bold uppercase text-background"
            >
              {day}
            </span>
          ))}
        </div>
        <div className="flex flex-col justify-center max-lg:items-center lg:items-end">
          <p className="text-small-lg font-bold">
            {props.times.split('-').join(' - ')}
          </p>
          <p className="text-small-lg">
            {props.modeOfInstruction} - {props.location}
          </p>
        </div>
      </div>
    </Card>
  </LinkBtn>
);
