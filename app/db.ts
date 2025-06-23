export const openDatabase = (dbName: string, storeName: string): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createTable = (db: IDBDatabase, storeName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getDBConnection = async (dbName: string, storeName: string): Promise<IDBDatabase | null> => {
  try {
    return await openDatabase(dbName, storeName);
  } catch (error) {
    console.error('Failed to get DB connection:', error);
    return null;
  }
};

export const getLanguagePreference = (db: IDBDatabase, storeName: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get('language');

    request.onsuccess = () => resolve(request.result?.value || null);
    request.onerror = () => reject(request.error);
  });
};

export const saveLanguagePreference = (db: IDBDatabase, storeName: string, language: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put({ id: 'language', value: language });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};