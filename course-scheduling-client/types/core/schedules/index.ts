export interface SchedulesSearchResponse {
  total_results: number;
  pages: number;
  page: number;
  filters: {
    term: { term: string; count: number }[] | null;
    year: { year: number; count: number }[] | null;
    professor_name: { professor_name: string; count: number }[] | null;
    course_number: { course_number: string; count: number }[] | null;
    department: { department: string; count: number }[] | null;
    mode_of_instruction:
      | { mode_of_instruction: string; count: number }[]
      | null;
    units: { units: number; count: number }[] | null;
  };
  items: {
    term: string;
    year: number;
    class_number: number;
    units: number;
    section: string;
    days: string;
    dates: string;
    times: string;
    class_type: string;
    location: string | null;
    mode_of_instruction: string;
    professor_id: string | null;
    professor_name: string | null;
    course_title: string;
    department: string | null;
    course_number: string;
    satisfies_area: string | null;
  }[];
}
