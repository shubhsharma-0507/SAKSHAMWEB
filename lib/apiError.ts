import { DatabaseNotConfiguredError } from '@/lib/db';

/** Best-effort, secret-free explanation of why the database call failed. */
export function describeDbProblem(error: unknown): { isDbProblem: boolean; message: string } {
  if (error instanceof DatabaseNotConfiguredError) {
    return { isDbProblem: true, message: 'The database is not configured. Set MONGODB_URI in .env.local and restart the server.' };
  }
  const text = `${(error as Error)?.name ?? ''} ${(error as Error)?.message ?? ''}`;
  if (/bad auth|authentication failed/i.test(text)) {
    return { isDbProblem: true, message: 'MongoDB rejected the username or password in MONGODB_URI.' };
  }
  if (/whitelist|not allowed|ip that isn't|Could not connect to any servers/i.test(text)) {
    return { isDbProblem: true, message: 'Could not reach MongoDB Atlas. Add this machine\'s IP under Atlas > Network Access.' };
  }
  if (/ENOTFOUND|querySrv|ECONNREFUSED|EAI_AGAIN|ETIMEDOUT|Invalid scheme|Invalid connection string/i.test(text)) {
    return { isDbProblem: true, message: 'MONGODB_URI looks wrong or the host cannot be reached. Copy the connection string from Atlas again.' };
  }
  if (/Mongo|Mongoose/i.test(text)) {
    return { isDbProblem: true, message: 'The database request failed.' };
  }
  return { isDbProblem: false, message: '' };
}

/** 503 with a helpful message for database problems, otherwise the given 500 message. */
export function dbErrorResponse(error: unknown, fallbackMessage: string): Response {
  const { isDbProblem, message } = describeDbProblem(error);
  if (isDbProblem) return Response.json({ success: false, error: message, code: 'DATABASE_UNAVAILABLE' }, { status: 503 });
  return Response.json({ success: false, error: fallbackMessage }, { status: 500 });
}
