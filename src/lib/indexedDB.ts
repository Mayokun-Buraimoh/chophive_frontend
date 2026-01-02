// indexeddb.ts
import { GuestCartItem } from "./interface";

const DB_NAME = "chopHiveCartDB";
const DB_VERSION = 1;
const STORE_NAME = "cart_items";

export function openCartDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("cart_id", "cart_id", { unique: false });
        store.createIndex("food_item_id", "food_item_id", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* ---------------- ADD / UPDATE ITEM ---------------- */
export async function addGuestCartItem(item: GuestCartItem): Promise<void> {
  const db = await openCartDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("food_item_id");

    const req = index.get(item.food_item_id);

    req.onsuccess = () => {
      const existing = req.result;

      if (existing) {
        existing.qty += item.qty;
        existing.sub_total = (
          Number(existing.price) * existing.qty
        ).toFixed(2);
        existing.total = existing.sub_total;
        existing.updated_at = new Date().toISOString();
        store.put(existing);
      } else {
        store.add(item);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------------- GET CART ---------------- */
export async function getGuestCart(cartId: string): Promise<GuestCartItem[]> {
  const db = await openCartDB();

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("cart_id");

    const items: GuestCartItem[] = [];
    const cursorReq = index.openCursor(IDBKeyRange.only(cartId));

    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      } else {
        resolve(items);
      }
    };
  });
}

/* ---------------- CLEAR CART ---------------- */
export async function clearGuestCart(cartId: string): Promise<void> {
  const db = await openCartDB();

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("cart_id");

    const cursorReq = index.openCursor(IDBKeyRange.only(cartId));

    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      }
    };

    tx.oncomplete = () => resolve();
  });
}


