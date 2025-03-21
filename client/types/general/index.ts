export type EvaluationType = 'bad' | 'ok' | 'good';
export type SessionType =
  | {
      email: string;
      first_name: string;
      last_name: string;
    }
  | null
  | undefined;
