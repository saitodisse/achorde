# @achorde/catalog-portal

Framework-free core for AC12/achorde catalog portals. The root entrypoint contains the editorial model, normalized search, deterministic monograms, deterministic Source Catalog `1.2.0` projection, and safe contribution application. The `/react` and `/browser` entrypoints are optional adapters for UI and IndexedDB.

The package never publishes charts without a `SourceCatalogRightsBasis` and sanitized evidence. Local drafts are excluded from the public projection.
