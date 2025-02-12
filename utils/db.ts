import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('videos.db');
  }
  return db;
};

// Create a table to store watch history
export const createTable = async () => {
  const database = await initDB();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS watch_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      videoId TEXT,
      synced INTEGER DEFAULT 0,
      watchTime REAL,
      playbackRate REAL,
      isCompleted INTEGER,
      lastWatchedAt TEXT
    );
  `);
};

// Function to insert watch data
export const saveWatchTime = async (videoId: string, watchTime: number) => {
  const database = await initDB();
  await database.runAsync(
    'INSERT INTO watch_history (video_id, watch_time) VALUES (?, ?);',
    [videoId, watchTime]
  );
};

export const saveWatchData = (videoId: string, watchTime: number, playbackRate: number, isCompleted: boolean) => {
  const timestamp = new Date().toISOString();

  db.runAsync(
    `INSERT INTO watch_history (videoId, watchTime, playbackRate, isCompleted, lastWatchedAt)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(videoId) DO UPDATE SET
       watchTime = excluded.watchTime,
       playbackRate = excluded.playbackRate,
       isCompleted = excluded.isCompleted,
       lastWatchedAt = excluded.lastWatchedAt;`,
    [videoId, watchTime, playbackRate, isCompleted ? 1 : 0, timestamp]

  );
};

// Function to retrieve unsynced watch data
export const getUnsyncedData = async () => {
  const database = await initDB();
  const result = await database.getAllAsync('SELECT * FROM watch_history WHERE synced = 0;');
  return result || [];
};

// Function to mark watch data as synced
export const markSynced = async (ids: number[]) => {
  const database = await initDB();
  await database.runAsync(`UPDATE watch_history SET synced = 1 WHERE id IN (${ids.join(',')});`);
};

export const clearWatchData = async () => {
  const database = await initDB();
  database.runAsync('DELETE FROM watch_history;');
};