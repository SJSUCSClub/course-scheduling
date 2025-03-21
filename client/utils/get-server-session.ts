import { SessionType } from '@/types';
import { cookies } from 'next/headers';

export const getServerSession = (): SessionType => {
  let session = cookies().get('user_data')?.value;

  if (session) {
    // Clean up escape characters, specific encoding issues, and trim the string
    session = session.replace(/\\/g, ''); // Remove any backslashes
    session = session.replace(/054/g, ','); // Replace '054' with commas if needed
    session = session.replace(/^"|"$/g, ''); // Remove any leading or trailing double quotes
    session = session.trim(); // Trim whitespace from both ends of the string
  }

  try {
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Failed to parse session:', error);
    return null;
  }
};
