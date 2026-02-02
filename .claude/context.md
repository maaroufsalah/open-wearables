# Open Wearables - Contexte Claude Code

> Ce fichier sert de mémoire pour les sessions Claude Code futures.
> Dernière mise à jour: 2026-02-03

---

## Projet

**Open Wearables** - API backend + frontend pour agréger les données de wearables (Garmin, Polar, Whoop, Suunto, Apple Health) et les exposer via une API unifiée.

- **Repo**: `https://github.com/maaroufsalah/open-wearables`
- **VPS Production**: `54.37.38.141`
- **Domaines**:
  - Frontend: `openwearables.ekygai.com`
  - API: `api-openwearables.ekygai.com` (à configurer)

---

## Stack Technique

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **DB**: PostgreSQL + SQLAlchemy
- **Cache/State**: Redis
- **Tasks**: Celery
- **Auth**: JWT + API Keys
- **Location**: `backend/`

### Frontend
- **Framework**: TanStack Start + React 19
- **Build**: Vite + Nitro (SSR)
- **Styling**: Tailwind CSS v4
- **Location**: `frontend/`

### Docker
- `docker-compose.yml` - Dev
- `docker-compose.prod.yml` - Production

---

## Historique des Fixes (Session 2026-02-03)

### 1. Plugin Order Fix
**Commit**: `f627c53`
**Problème**: Erreur Vite - `@vitejs/plugin-react` avant `@tanstack/router-plugin`
**Solution**: Réorganisé `frontend/vite.config.ts`:
```typescript
plugins: [
  devtools(),
  tanstackStart(),  // AVANT viteReact
  viteReact(),
  nitro({...}),
  viteTsConfigPaths({...}),
  tailwindcss(),
]
```
Ajouté `strictPort: true` et `allowedHosts` pour production.

### 2. jsxDEV Fix
**Commit**: `5843759`
**Problème**: `TypeError: jsxDEV is not a function` en production
**Solution**: Simplifié `viteReact()` sans config explicite (gère auto dev/prod).

### 3. TanStack Router Production Config
**Commit**: `1d91d03`
**Problème**: jsxDEV persistant malgré fix précédent
**Solution**:
- Configuré `tanstackStart({ router: { generatedRouteTree, autoCodeSplitting } })`
- Créé `frontend/.env.production` avec `NODE_ENV=production`

---

## Structure API Backend

### Endpoints Clés
```
POST   /api/v1/users                              # Créer user
GET    /api/v1/users/{id}/connections             # Devices connectés
GET    /api/v1/oauth/{provider}/authorize         # Initier OAuth
GET    /api/v1/oauth/{provider}/callback          # Callback OAuth
POST   /api/v1/providers/{provider}/users/{id}/sync  # Sync data
GET    /api/v1/users/{id}/summaries/activity      # Activités
GET    /api/v1/users/{id}/summaries/sleep         # Sommeil
GET    /api/v1/users/{id}/summaries/body          # Métriques corps
GET    /api/v1/users/{id}/timeseries              # Données granulaires
```

### Providers Supportés
| Provider | OAuth | Webhooks | Notes |
|----------|-------|----------|-------|
| Garmin | PKCE | Oui | Le plus complet |
| Polar | OAuth2 | Non | Accesslink API |
| Whoop | OAuth2 | Non | Cycles API |
| Suunto | OAuth2 | Non | REST API |
| Apple | SDK | Non | Via XML export |

### Auth
- **API Key**: Header `X-Open-Wearables-API-Key`
- **JWT**: Header `Authorization: Bearer <token>`

---

## Fichiers Importants

### Backend
- `backend/app/api/v1/routers/` - Tous les endpoints
- `backend/app/schemas/` - Modèles Pydantic
- `backend/app/services/providers/` - Intégrations providers
- `backend/app/core/config.py` - Configuration

### Frontend
- `frontend/vite.config.ts` - Config Vite (ORDRE PLUGINS CRITIQUE)
- `frontend/app/router.tsx` - Routes TanStack
- `frontend/.env.production` - Env prod

### Docker
- `docker-compose.prod.yml` - Stack production
- `frontend/Dockerfile` - Build frontend SSR

---

## Commandes Utiles

### VPS Deployment
```bash
ssh root@54.37.38.141
cd /root/open-wearables
git pull origin main
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Local Dev
```bash
# Backend
cd backend && uv sync && uv run uvicorn app.main:app --reload

# Frontend
cd frontend && pnpm install && pnpm dev
```

---

## Notes pour Futures Sessions

1. **Si erreur Vite plugin order**: Vérifier `tanstackStart()` AVANT `viteReact()` dans `vite.config.ts`
2. **Si erreur jsxDEV**: Utiliser `viteReact()` sans config, vérifier `NODE_ENV=production`
3. **Pour intégration EKYGAI**: Voir `docs/EKYGAI_INTEGRATION.md`
4. **API Key pour tests**: Créer via endpoint `/api/v1/developers` ou admin panel
