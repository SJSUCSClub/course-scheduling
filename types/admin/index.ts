export interface AdminVerifyResponse {
  isAdmin: boolean;
}

export interface AdminFlaggedReviews {
  total_results: number;
  pages: number;
  page: number;
  items: {
    user_id: string;
    created_at: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Declined';
    review_content: string;
  }[];
}
export interface AdminList {
  total_results: number;
  pages: number;
  page: number;
  items: {
    user_id: string;
    admin_role: 'Administrator' | 'Moderator';
    created_at: string;
  }[];
}
