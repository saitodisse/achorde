import { useMemo, useState } from "react";
import type { EditorialCatalog, LocalDraft } from "./index";
import { createArtistMonogram, searchCatalog } from "./index";

export function CatalogSearch({ catalog, onSelect }: { catalog: EditorialCatalog; onSelect?: (result: ReturnType<typeof searchCatalog>[number]) => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCatalog(catalog, query), [catalog, query]);
  return <section aria-label="Busca no catálogo">
    <label htmlFor="catalog-search">Buscar artista ou música</label>
    <input id="catalog-search" value={query} onChange={(event) => setQuery(event.target.value)} type="search" />
    <ul aria-live="polite">{results.map((result) => <li key={`${result.kind}:${result.kind === "artist" ? result.artist.id : result.work.id}`}>
      <button type="button" onClick={() => onSelect?.(result)}>{result.kind === "artist" ? result.artist.name : `${result.work.title} — ${result.artist.name}`}</button>
    </li>)}</ul>
  </section>;
}

export function CatalogReader({ title, text, published = false }: { title: string; text?: string; published?: boolean }) {
  return <article aria-label={title}><h1>{title}</h1>{text && published ? <pre>{text}</pre> : <p>Cifra ainda não publicada.</p>}</article>;
}

export function CatalogEditor({ initial, onComplete }: { initial: LocalDraft; onComplete?: (draft: LocalDraft) => void }) {
  const [text, setText] = useState(initial.text);
  return <form onSubmit={(event) => { event.preventDefault(); onComplete?.({ ...initial, text, updatedAt: new Date().toISOString() as LocalDraft["updatedAt"] }); }}>
    <label htmlFor="catalog-editor">Rascunho local</label>
    <textarea id="catalog-editor" value={text} onChange={(event) => setText(event.target.value)} rows={18} />
    <button type="submit">Concluir edição</button>
  </form>;
}

export function ArtistMonogram({ artist }: { artist: Parameters<typeof createArtistMonogram>[0] }) {
  const monogram = createArtistMonogram(artist);
  return <span aria-hidden="true" style={{ backgroundColor: monogram.color }}>{monogram.initials}</span>;
}
