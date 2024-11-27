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
let db;
async function initDB() {
  db = await openDB(DB_NAME, 1, {
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

initDB(); // Initialize the database during runtime
export { db };

export const dbOperations = {
  async addTask(task) {
    return db.add(STORE_NAME, task);
  },

  async getAllTasks() {
    return db.getAll(STORE_NAME);
  },

  async updateTask(task) {
    return db.put(STORE_NAME, task);
  },

  async deleteTask(id) {
    return db.delete(STORE_NAME, id);
  },
};
