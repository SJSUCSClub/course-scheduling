export type AdminEnum = 'Administrator' | 'Moderator';
export interface AdminVerifyResponse {
  isAdmin: boolean;
  role: AdminEnum | undefined;
}

export interface AdminFlaggedReviewsResponse {
  total_results: number;
  pages: number;
  page: number;
  items: {
    // reviews properties
    user_id: string | null;
    id: number;
    created_at: string;
    updated_at: string | null;
    flag_immune_until: string | null;
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
    // flags
    flags: {
      user_id: string;
      review_id: string;
      created_at: string;
      reason: string;
      status: 'Pending' | 'Approved' | 'Declined';
    }[];
  }[];
}
export interface AdminListResponse {
  total_results: number;
  pages: number;
  page: number;
  items: {
    user_id: string;
    admin_role: AdminEnum;
    created_at: string;
  }[];
}
