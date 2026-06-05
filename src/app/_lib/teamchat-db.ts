import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

interface TeamchatUser {
  id: number;
  username: string;
  nickname: string | null;
}

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath = process.env.TEAMCHAT_DB_PATH;
  if (!dbPath) {
    throw new Error("TEAMCHAT_DB_PATH environment variable is not set");
  }

  _db = new Database(dbPath, { readonly: true });
  _db.pragma("journal_mode = WAL");
  return _db;
}

export function getTeamchatUser(username: string): TeamchatUser | null {
  const db = getDb();
  const row = db
    .prepare("SELECT id, username, nickname FROM users WHERE username = ?")
    .get(username) as TeamchatUser | undefined;
  return row ?? null;
}

export async function verifyTeamchatUser(
  username: string,
  password: string
): Promise<TeamchatUser | null> {
  const db = getDb();
  const row = db
    .prepare("SELECT id, username, password, nickname FROM users WHERE username = ?")
    .get(username) as (TeamchatUser & { password: string }) | undefined;

  if (!row) return null;

  const valid = await bcrypt.compare(password, row.password);
  if (!valid) return null;

  return { id: row.id, username: row.username, nickname: row.nickname };
}
