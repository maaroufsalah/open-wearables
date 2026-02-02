# Open Wearables API - Guide d'Intégration EKYGAI

> **Base URL Production**: `https://api-openwearables.ekygai.com/api/v1`
> **Auth Header**: `X-Open-Wearables-API-Key: <your_api_key>`

---

## 1. Endpoints Essentiels

### Utilisateurs
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/users` | POST | Créer utilisateur |
| `/users/{id}` | GET | Récupérer utilisateur |
| `/users/{id}/connections` | GET | Lister devices connectés |

### OAuth (Connexion Device)
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/oauth/{provider}/authorize` | GET | Obtenir URL OAuth |
| `/oauth/{provider}/callback` | GET | Callback après auth |
| `/oauth/providers` | GET | Lister providers disponibles |

### Données
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/users/{id}/summaries/activity` | GET | Activité journalière |
| `/users/{id}/summaries/sleep` | GET | Sommeil journalier |
| `/users/{id}/summaries/body` | GET | Métriques corporelles |
| `/users/{id}/summaries/recovery` | GET | Récupération |
| `/users/{id}/timeseries` | GET | Données granulaires |
| `/providers/{provider}/users/{id}/workouts` | GET | Liste des workouts |

### Sync
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/providers/{provider}/users/{id}/sync` | POST | Déclencher sync |
| `/garmin/users/{id}/backfill-status` | GET | Statut backfill Garmin |

---

## 2. Providers Supportés

| Provider | OAuth | Webhooks | 24/7 Data | Scope |
|----------|-------|----------|-----------|-------|
| **Garmin** | PKCE | Ping/Push | Complet | - |
| **Polar** | OAuth2 | Non | Limité | `accesslink.read_all` |
| **Whoop** | OAuth2 | Non | Sleep/Recovery | `offline read:cycles read:sleep read:recovery read:workout` |
| **Suunto** | OAuth2 | Non | Oui | - |
| **Apple** | SDK | Non | Via export | - |

---

## 3. Flow OAuth Complet

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   EKYGAI    │────▶│  Open Wearables  │────▶│   Garmin    │
│  Frontend   │     │      API         │     │   OAuth     │
└─────────────┘     └──────────────────┘     └─────────────┘
      │                     │                       │
      │ 1. GET /oauth/garmin/authorize?user_id=xxx  │
      │◀────────────────────│                       │
      │    { authorization_url, state }             │
      │                                             │
      │ 2. Redirect user ──────────────────────────▶│
      │                                             │
      │ 3. User authorizes ◀───────────────────────│
      │                                             │
      │ 4. Callback: /oauth/garmin/callback?code=xxx│
      │────────────────────▶│                       │
      │                     │ 5. Exchange code      │
      │                     │──────────────────────▶│
      │                     │◀──────────────────────│
      │                     │   { access_token }    │
      │                     │                       │
      │ 6. Redirect to success page                 │
      │◀────────────────────│                       │
```

---

## 4. Schemas de Données

### Activity Summary
```json
{
  "date": "2024-01-20",
  "source": { "provider": "garmin", "device": "Forerunner 965" },
  "steps": 8432,
  "distance_meters": 6240.5,
  "active_calories_kcal": 342.5,
  "total_calories_kcal": 2150.0,
  "active_minutes": 60,
  "intensity_minutes": { "light": 45, "moderate": 25, "vigorous": 10 },
  "heart_rate": { "avg_bpm": 72, "max_bpm": 155, "min_bpm": 52 }
}
```

### Sleep Summary
```json
{
  "date": "2024-01-20",
  "start_time": "2024-01-19T23:30:00Z",
  "end_time": "2024-01-20T07:30:00Z",
  "duration_minutes": 450,
  "efficiency_percent": 89.5,
  "stages": {
    "awake_minutes": 30,
    "light_minutes": 120,
    "deep_minutes": 180,
    "rem_minutes": 120
  },
  "avg_heart_rate_bpm": 58,
  "avg_hrv_sdnn_ms": 45.2
}
```

### Body Summary
```json
{
  "slow_changing": {
    "weight_kg": 72.5,
    "height_cm": 175.5,
    "body_fat_percent": 18.5,
    "bmi": 23.5
  },
  "averaged": {
    "period_days": 7,
    "resting_heart_rate_bpm": 62,
    "avg_hrv_sdnn_ms": 45.2
  }
}
```

### Timeseries Types
- `heart_rate`, `resting_heart_rate`, `heart_rate_variability_sdnn`
- `steps`, `energy`, `distance_walking_running`
- `oxygen_saturation`, `respiratory_rate`
- `weight`, `body_fat_percentage`, `body_temperature`

---

## 5. Code TypeScript EKYGAI

```typescript
const API = 'https://api-openwearables.ekygai.com/api/v1';
const headers = { 'X-Open-Wearables-API-Key': process.env.OW_API_KEY! };

// Créer utilisateur
export async function createUser(ekygaiUserId: string, email: string) {
  const res = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ external_user_id: ekygaiUserId, email })
  });
  return res.json();
}

// Obtenir lien OAuth
export async function getOAuthUrl(userId: string, provider: string, redirectUri: string) {
  const params = new URLSearchParams({ user_id: userId, redirect_uri: redirectUri });
  const res = await fetch(`${API}/oauth/${provider}/authorize?${params}`);
  return res.json(); // { authorization_url, state }
}

// Récupérer activités
export async function getActivities(userId: string, startDate: string, endDate: string) {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
  const res = await fetch(`${API}/users/${userId}/summaries/activity?${params}`, { headers });
  return res.json();
}

// Récupérer sommeil
export async function getSleep(userId: string, startDate: string, endDate: string) {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
  const res = await fetch(`${API}/users/${userId}/summaries/sleep?${params}`, { headers });
  return res.json();
}

// Récupérer timeseries
export async function getTimeseries(
  userId: string,
  startTime: string,
  endTime: string,
  types: string[]
) {
  const params = new URLSearchParams({ start_time: startTime, end_time: endTime });
  types.forEach(t => params.append('types', t));
  const res = await fetch(`${API}/users/${userId}/timeseries?${params}`, { headers });
  return res.json();
}

// Déclencher sync
export async function triggerSync(userId: string, provider: string) {
  const res = await fetch(`${API}/providers/${provider}/users/${userId}/sync?async=true`, {
    method: 'POST',
    headers
  });
  return res.json(); // { task_id, success }
}
```

---

## 6. Variables d'Environnement (Backend)

```bash
# Database
DB_HOST=db
DB_PORT=5432
DB_NAME=open-wearables
DB_USER=open-wearables
DB_PASSWORD=<secret>

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Auth
SECRET_KEY=<32_bytes_random>

# Garmin
GARMIN_CLIENT_ID=<from_dev_portal>
GARMIN_CLIENT_SECRET=<encrypted>
GARMIN_REDIRECT_URI=https://api-openwearables.ekygai.com/api/v1/oauth/garmin/callback

# Polar
POLAR_CLIENT_ID=<from_dev_portal>
POLAR_CLIENT_SECRET=<encrypted>
POLAR_DEFAULT_SCOPE=accesslink.read_all

# CORS
CORS_ORIGINS=["https://ekygai.com","https://openwearables.ekygai.com"]
```

---

## 7. Checklist Intégration

- [ ] Créer clé API Open Wearables pour EKYGAI
- [ ] Configurer CORS avec domaine EKYGAI
- [ ] Implémenter création user lors de l'onboarding EKYGAI
- [ ] Ajouter boutons "Connecter Garmin/Polar" dans profil
- [ ] Gérer callback OAuth (stocker mapping user)
- [ ] Implémenter polling ou webhooks pour sync
- [ ] Afficher données wearables dans dashboard EKYGAI
