# Open Wearables - Configuration EKYGAI

## Mission Claude Code

Tu es responsable de maintenir et optimiser ce fork d'Open Wearables pour l'intégration avec EKYGAI. Ton rôle inclut :

### 1. Optimisation des tokens
- Créer des résumés concis de chaque module dans `.claude/summaries/`
- Utiliser les artifacts pour les gros fichiers de config
- Maintenir un contexte minimal mais complet
- Documenter les décisions architecturales

### 2. Documentation technique
- Architecture système complète
- Flux OAuth détaillés (Garmin, Polar, Apple, etc.)
- API endpoints et leurs utilisations
- Schémas de données PostgreSQL
- Guide d'intégration avec EKYGAI web/mobile

### 3. Déploiement production
- VPS OVH Ubuntu 25.04
- Sous-domaines : openwearables.ekygai.com / api-openwearables.ekygai.com
- Docker + Nginx + Cloudflare
- Monitoring et logs

### 4. Intégration EKYGAI
- API REST pour synchronisation des données
- Webhooks pour événements en temps réel
- Authentification unifiée
- Mapping des métriques vers CE/FG

## Structure de documentation attendue
````
.claude/
├── PROJECT_SETUP.md (ce fichier)
├── ARCHITECTURE.md
├── OAUTH_FLOWS.md
├── API_INTEGRATION.md
├── DEPLOYMENT_GUIDE.md
└── summaries/
    ├── backend.md
    ├── frontend.md
    ├── database.md
    └── auth.md
````

## Contexte EKYGAI

EKYGAI est une plateforme SaaS de coaching sportif utilisant :
- Métriques propriétaires : CE (Charge d'Entraînement) et FG (Fatigue Générale)
- Stack : Next.js + .NET Core 8 + PostgreSQL
- Mobile : React Native
- Classification athlètes : EKY0-EKY5

Open Wearables sert de couche d'intégration pour synchroniser les données des wearables vers EKYGAI.

## Principes d'optimisation des tokens

1. **Résumés hiérarchiques** : Commencer large, puis zoomer sur demande
2. **Artifacts systématiques** : Code complet > 50 lignes = artifact
3. **Contexte incrémental** : Charger uniquement ce qui est nécessaire
4. **Documentation référencée** : Liens vers docs externes plutôt que duplication
5. **Exemples concrets** : Toujours inclure un exemple d'utilisation

## Commandes principales

### Analyse initiale
````bash
# Analyser l'architecture
claude-code "Analyse l'architecture complète et crée ARCHITECTURE.md"

# Documenter les flux OAuth
claude-code "Documente tous les flux OAuth dans OAUTH_FLOWS.md avec diagrammes"

# Créer le guide d'intégration
claude-code "Crée API_INTEGRATION.md avec exemples cURL et code"
````

### Déploiement
````bash
# Générer les configs de déploiement
claude-code "Crée les fichiers de déploiement production optimisés"

# Débugger le problème Nitro actuel
claude-code "Débugue pourquoi Nitro ne répond pas via Nginx"
````

## Questions prioritaires à répondre

1. Configuration `.env` complète pour production
2. Comment créer un compte utilisateur (API + UI)
3. Comment connecter Garmin/Polar (flux OAuth complet)
4. Comment récupérer les données synchronisées (API endpoints)
5. Mapping des données wearables vers métriques EKYGAI
6. Sécurité : Rate limiting, authentification, CORS

## État actuel du déploiement

**VPS OVH**
- IP: 54.37.38.141
- OS: Ubuntu 25.04
- Docker Compose actif
- Backend fonctionne (FastAPI Swagger à http://localhost:8000/docs)
- Frontend ne répond pas (Nitro binding issue)

**Problème actuel**
Le serveur Nitro démarre mais refuse les connexions externes. Logs : "Connection reset by peer"

**Solution probable**
Modifier Dockerfile pour bind sur 0.0.0.0 avec NITRO_HOST explicite.

---

## Workflow de travail

1. **Toujours** créer/mettre à jour la documentation avant le code
2. **Toujours** tester en local avant de déployer
3. **Toujours** commiter avec des messages descriptifs
4. **Toujours** créer des branches pour chaque feature
5. **Toujours** documenter les décisions dans `.claude/decisions/`

## Prochaines tâches

- [ ] Créer ARCHITECTURE.md complet
- [ ] Documenter OAUTH_FLOWS.md avec diagrammes
- [ ] Résoudre le problème Nitro/Nginx
- [ ] Créer API_INTEGRATION.md
- [ ] Tester le workflow complet utilisateur
- [ ] Intégrer avec l'API EKYGAI existante