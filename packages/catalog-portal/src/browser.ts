import type { LocalDraft } from "./index";

export type DraftRepository = {
  get(id: string): Promise<LocalDraft | undefined>;
  list(): Promise<LocalDraft[]>;
  save(draft: LocalDraft): Promise<void>;
  remove(id: string): Promise<void>;
};

export function createMemoryDraftRepository(): DraftRepository {
  const drafts = new Map<string, LocalDraft>();
  return {
    async get(id) { return drafts.get(id); },
    async list() { return [...drafts.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); },
    async save(draft) { drafts.set(draft.id, draft); },
    async remove(id) { drafts.delete(id); },
  };
}

export function createIndexedDbDraftRepository(name = "achorde-catalog-portal"): DraftRepository {
  if (typeof indexedDB === "undefined") return createMemoryDraftRepository();
  const open = () => new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("drafts", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB unavailable."));
  });
  return {
    async get(id) { const db = await open(); return new Promise((resolve, reject) => { const request = db.transaction("drafts").objectStore("drafts").get(id); request.onsuccess = () => resolve(request.result as LocalDraft | undefined); request.onerror = () => reject(request.error); }); },
    async list() { const db = await open(); return new Promise((resolve, reject) => { const request = db.transaction("drafts").objectStore("drafts").getAll(); request.onsuccess = () => resolve((request.result as LocalDraft[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))); request.onerror = () => reject(request.error); }); },
    async save(draft) { const db = await open(); return new Promise((resolve, reject) => { const request = db.transaction("drafts", "readwrite").objectStore("drafts").put(draft); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); },
    async remove(id) { const db = await open(); return new Promise((resolve, reject) => { const request = db.transaction("drafts", "readwrite").objectStore("drafts").delete(id); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); },
  };
}

export function registerCatalogServiceWorker(url = "/sw.js"): Promise<ServiceWorkerRegistration | undefined> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return Promise.resolve(undefined);
  return navigator.serviceWorker.register(url);
}

export async function waitForDraftSave(save: () => Promise<void>): Promise<void> {
  await save();
}
