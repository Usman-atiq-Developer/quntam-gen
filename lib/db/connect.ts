import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * In Next.js dev mode, modules are reloaded on every file change, which would
 * otherwise create a new Mongoose connection on every request and quickly
 * exhaust MongoDB's connection limit. In serverless production (Vercel), each
 * warm lambda instance should also reuse a single connection instead of
 * opening a new one per invocation. Caching the connection promise on the
 * Node.js global object solves both problems.
 */
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new DatabaseConfigError(
      "MONGODB_URI is not set. Add it to your .env.local file (see .env.local.example)."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        // Without these, the MongoDB driver's own defaults (up to ~30s)
        // apply — meaning every independent page/request that touches the
        // DB pays a long, silent stall before falling back or erroring if
        // Mongo is briefly unreachable (wrong URI, Atlas IP allowlist
        // issue, network blip). Failing fast lets the existing
        // try/catch-with-fallback pattern used throughout lib/posts.ts and
        // lib/siteData.ts kick in quickly instead of hanging.
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset the cached promise so the next request can retry the connection
    // instead of being stuck replaying a failed connection attempt forever.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

/**
 * Thrown when the app tries to talk to the database but MONGODB_URI is
 * missing or invalid. Kept as a distinct class so API routes can catch it
 * and return a clear 500 with a helpful message instead of a generic crash.
 */
export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}
