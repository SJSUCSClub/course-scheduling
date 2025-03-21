export interface CoursesSearchResponse {
  total_results: number;
  pages: number;
  page: number;
  filters: {
    departments: { department: string; count: number }[];
    units: { units: string; count: number }[];
    satisfies_area: { satisfies_area: string; count: number }[];
  };
  items: {
    name: string;
    department: string;
    course_number: string;
    units: string | null;
    description: string | null;
    prereqs: string | null;
    satisfies_area: string | null;
  }[];
}
export interface CoursesIDSchedulesResponse {
  total_results: number;
  pages: number;
  page: number;
  items: {
    term: string;
    year: number;
    class_number: number;
    section: string;
    days: string;
    dates: string;
    times: string;
    class_type: string;
    course_title: string;
    units: number;
    location: string | null;
    mode_of_instruction: string;
    professor_id: string | null;
    department: string | null;
    course_number: string;
    professor_name: string | null;
  }[];
}
export interface CoursesIDReviewsResponse {
  total_results: number;
  page: number;
  pages: number;
  filters: {
    tags: { tag: string; count: number }[];
  };
  items: {
    user_id: string | null;
    id: number;
    created_at: string;
    updated_at: string | null;
    reviewer_name: string | null;
    reviewer_username: string | null;
    course_number: string;
    department: string;
    professor_id: string | null;
    professor_name: string;
    professor_email: string;
    content: string;
    quality: number;
    ease: number;
    grade: string | null;
    tags: string[];
    take_again: boolean;
    is_user_anonymous: boolean;
    user_vote: boolean | null;
    votes: {
      upvotes: number;
      downvotes: number;
    };
  }[];
}
export interface CoursesIDReviewStatsResponse {
  department: string;
  course_number: string;
  avg_rating: number | null;
  avg_quality: number | null;
  avg_ease: number | null;
  avg_grade: string | null;
  rating_distribution: number[];
  quality_distribution: number[];
  ease_distribution: number[];
  grade_distribution: number[];
  total_reviews: number;
  take_again_percent: number | null;
}
export interface CoursesIDSummaryResponse {
  name: string;
  department: string;
  course_number: string;
  units: string | null;
  description: string | null;
  prereqs: string | null;
  satisfies_area: string | null;
}

export interface CoursesHighestRatedResponse {
  highest_rated: (CoursesIDReviewStatsResponse & CoursesIDSummaryResponse)[];
}
