// Custom error class to handle fetch errors
export class FetchError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, status?: number, info?: unknown) {
    super(message);
    this.info = info;
    this.status = status ?? 500;
    // Set the prototype explicitly to allow instanceof checks
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

// From the SWR docs
const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, init);
  // artificial timeout to see loading state
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new FetchError('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    console.error(error);
    throw error;
  }

  const data = await res.json();

  return data;
};

export default fetcher;
