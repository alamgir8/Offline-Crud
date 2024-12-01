import { openDB } from "idb";
import { DB_NAME, STORE_NAME } from "./constants.js";

// export const db = await openDB(DB_NAME, 1, {
//   upgrade(db) {
//     const store = db.createObjectStore(STORE_NAME, {
//       keyPath: "id",
//       autoIncrement: true,
//     });
//     store.createIndex("status", "status");
//     store.createIndex("createdAt", "createdAt");
//   },
// });
let dbPromise;

async function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("status", "status");
        store.createIndex("createdAt", "createdAt");
      },
    });
  }
  return dbPromise;
}

export const dbOperations = {
  async addTask(task) {
    const db = await initDB();
    return db.add(STORE_NAME, task);
  },

  async getAllTasks() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
  },

  async updateTask(task) {
    const db = await initDB();
    return db.put(STORE_NAME, task);
  },

  async deleteTask(id) {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
  },
};
