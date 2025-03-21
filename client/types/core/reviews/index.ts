export type ReviewsIDCommentsResponse = {
  id: number;
  review_id: number;
  user_id: string | null;
  created_at: string;
  updated_at: string | null;
  content: string;
}[];

export type GetReviewsResponse = {
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
};
