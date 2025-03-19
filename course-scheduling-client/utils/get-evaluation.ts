import { EvaluationType } from '@/types';

const getRatingEvaluation = (rating: number): EvaluationType => {
  if (rating < 2) {
    return 'bad';
  } else if (rating < 4) {
    return 'ok';
  } else {
    return 'good';
  }
};

const getGradeEvaluation = (grade: string): EvaluationType => {
  switch (grade) {
    case 'F':
    case 'D-':
    case 'D':
    case 'D+':
      return 'bad';
    case 'C-':
    case 'C':
    case 'C+':
    case 'B-':
    case 'B':
    case 'B+':
      return 'ok';
    case 'A-':
    case 'A':
    case 'A+':
      return 'good';
    default:
      throw new Error('Invalid grade input');
  }
};

const getPercentageEvaluation = (percentage: number): EvaluationType => {
  if (percentage < 50) {
    return 'bad';
  } else if (percentage < 80) {
    return 'ok';
  } else {
    return 'good';
  }
};

/**
 * Returns the evaluation of the input based on the type. This is useful for conditionally rendering the color of a rating, grade, percentage, or fraction.
 * @param input - The input to evaluate.
 * @param type - The type of input to evaluate.
 * @returns The evaluation of the input.
 *
 * @component
 * @example
 * return (
 *  <div className={clsx({
 *      'text-bad': getEvaluation(avgGrade, 'grade') === 'bad'
 *  })}>
 *    {avgGrade}
 *  </div>
 * )
 */
const getEvaluation = (
  input: string | number,
  type: 'rating' | 'grade' | 'percentage' = 'rating',
): EvaluationType => {
  switch (type) {
    case 'rating':
      return getRatingEvaluation(input as number);
    case 'grade':
      return getGradeEvaluation(input as string);
    case 'percentage':
      return getPercentageEvaluation(input as number);
    default:
      throw new Error('Invalid input type');
  }
};

export default getEvaluation;
