export interface ProfessorsSearchResponse {
  total_results: number;
  pages: number;
  page: number;
  items: {
    name: string;
    email: string;
    id: string;
  }[];
}
export interface ProfessorsIDSummaryResponse {
  id: string;
  name: string;
  email: string;
}
export interface ProfessorsIDSchedulesResponse {
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
    units: number;
    location: string | null;
    mode_of_instruction: string;
    course_title: string;
    department: string | null;
    course_number: string;
  }[];
}

export interface ProfessorsIDReviewsResponse {
  total_results: number;
  pages: number;
  page: number;
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
export interface ProfessorsIDReviewStatsResponse {
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
  tags: { tag: string; count: number }[];
}

export interface ProfessorsHighestRatedResponse {
  highest_rated: (ProfessorsIDReviewStatsResponse &
    ProfessorsIDSummaryResponse)[];
}
