import { Course, Review, User } from '@/types/database';
import {
  PaginatedItems,
  PercentageType,
  SearchResultSortType,
} from '@/types/general';

interface CourseSearch
  extends Pick<Review, 'overall' | 'grade'>,
    Pick<
      Course,
      'courseNumber' | 'department' | 'name' | 'satisfiesArea' | 'units'
    > {
  openSections: number;
  totalSections: number;
  totalReviews: number;
  takeAgain?: PercentageType;
  professors: { id: User['id']; name: User['name'] }[];
}

export interface CourseSearchRouteResponse
  extends PaginatedItems<CourseSearch> {
  totalResults: number;
  filters: {
    search: string;
    sort: SearchResultSortType;
    professors: { id: User['id']; name: User['name']; count: number }[];
  };
}
export interface CourseSearchRouteParams
  extends Pick<PaginatedItems<CourseSearch>, 'itemsPerPage' | 'page'> {}
export interface CourseSearchRouteBody {
  filters?: {
    search?: string;
    sort?: SearchResultSortType;
    professors?: { id: User['id']; name: User['name'] }[];
  };
}
