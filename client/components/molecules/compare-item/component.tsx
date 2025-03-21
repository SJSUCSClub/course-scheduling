import { Card, LinkBtn, Stars } from '@/components/atoms';
import { cn } from '@/utils/cn';
import getEvaluation from '@/utils/get-evaluation';
import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/16/solid';

interface Props {
  link: string;
  id: string;
  review?: number;
  totalReviews: number;
  avgGrade?: string | null;
  takeAgainPercent?: number;
}

export const CompareItem: React.FC<Props> = (props) => (
  <LinkBtn
    variant="tertiary"
    className="w-fit rounded-md p-0 text-inherit"
    href={props.link}
  >
    <Card className="flex w-fit flex-col gap-sm rounded-md p-md">
      <div>
        <p className="font-bold">{props.id}</p>
        <div className="flex items-center gap-sm">
          {props.review ? (
            <p className="text-small-lg">{props.review}</p>
          ) : (
            <p className="text-small-lg text-neutral">-</p>
          )}

          <div className="w-[100px]">
            <Stars rating={props.review ?? 0} />
          </div>
          <p className="text-nowrap text-small-sm text-neutral">
            {props.totalReviews} Reviews
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-xs">
        <div className="flex items-center gap-xs text-neutral">
          <ClipboardDocumentListIcon width={16} height={16} />
          <p className="text-small-sm">
            Average Grade:{' '}
            {props.avgGrade ? (
              <span
                className={cn({
                  'text-good':
                    getEvaluation(props.avgGrade, 'grade') === 'good',
                  'text-ok': getEvaluation(props.avgGrade, 'grade') === 'ok',
                  'text-bad': getEvaluation(props.avgGrade, 'grade') === 'bad',
                })}
              >
                {props.avgGrade}
              </span>
            ) : (
              <span className="text-neutral">-</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-xs text-neutral">
          <ArrowPathIcon width={16} height={16} />
          <p className="text-small-sm">
            Would Take Again:{' '}
            {props.takeAgainPercent ? (
              <span
                className={cn({
                  'text-good':
                    getEvaluation(props.takeAgainPercent, 'percentage') ===
                    'good',
                  'text-ok':
                    getEvaluation(props.takeAgainPercent, 'percentage') ===
                    'ok',
                  'text-bad':
                    getEvaluation(props.takeAgainPercent, 'percentage') ===
                    'bad',
                })}
              >
                {props.takeAgainPercent}%
              </span>
            ) : (
              <span className="text-neutral">-</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  </LinkBtn>
);
