# Guide d'Optimisation des Tokens - Claude Code

## Principes fondamentaux

### 1. Structure hiérarchique de la documentation

**Niveau 1 : Vue d'ensemble (200-500 tokens)**
- Architecture globale en 3-5 paragraphes
- Liste des composants principaux
- Schéma ASCII simple

**Niveau 2 : Modules (500-1000 tokens par module)**
- Responsabilités du module
- Interfaces principales
- Dépendances
- Exemples d'utilisation basiques

**Niveau 3 : Détails d'implémentation (sur demande uniquement)**
- Code complet dans artifacts
- Configurations spécifiques
- Edge cases

### 2. Utilisation des artifacts

**Toujours utiliser artifacts pour :**
- Code > 50 lignes
- Fichiers de configuration complets
- Logs de debug
- Schémas de base de données
- Réponses JSON complètes

**Format :**
````xml
<artifact identifier="backend-env" type="text/plain" title="Backend .env Configuration">
[contenu complet]
</artifact>
````

### 3. Résumés de fichiers

**Template pour `.claude/summaries/[module].md` :**
````markdown
# [Module Name] - Résumé

**Responsabilité** : [1 phrase]

**Technologies** : [liste]

**Points d'entrée** :
- [fichier] : [rôle]

**Dépendances** :
- [module] : [raison]

**Configuration** :
- [variable] : [usage]

**Endpoints/API** (si applicable) :
- `GET /path` : [description]

**Schéma de données** (si applicable) :
- Table X : [colonnes principales]

**Exemple d'utilisation** :
```[language]
[code minimal]
```

**Fichiers clés** :
- [path] : [description]

**TODO/Notes** :
- [point à améliorer]
````

### 4. Stratégie de chargement de contexte

**Pour une question sur l'authentification :**
````
1. Charger : .claude/summaries/auth.md (200 tokens)
2. Si insuffisant : backend/app/auth/[fichier spécifique] (500 tokens)
3. Si besoin de config : .env.example via artifact (0 tokens conversationnels)
````

**Pour le déploiement :**
````
1. Charger : DEPLOYMENT_GUIDE.md niveau 1 (300 tokens)
2. Si problème spécifique : Section concernée uniquement
3. Logs via artifact si besoin de debug
````

### 5. Conventions de documentation

**Diagrammes ASCII (pas de Mermaid dans summaries)** :
````
Frontend (React)  →  Nginx  →  Backend (FastAPI)  →  PostgreSQL
                                     ↓
                                  Redis
                                     ↓
                              Celery Workers
````

**Liens internes** :
````markdown
Voir [OAuth Flows](.claude/OAUTH_FLOWS.md#garmin) pour détails.
````

**Exemples concrets toujours** :
````markdown
❌ "Configure les variables d'environnement"
✅ "Configure DATABASE_URL=postgresql://user:pass@db:5432/dbname"
````

### 6. Mesure de l'efficacité

**Objectifs :**
- Question simple : < 2000 tokens de contexte
- Question complexe : < 5000 tokens de contexte
- Réponse complète : Documentation + Code dans artifact

**Métriques à suivre :**
- Nombre de tours de conversation pour résoudre un problème
- Tokens utilisés par type de question
- Fréquence de rechargement de contexte

### 7. Templates de réponse

**Question sur configuration :**
1. Résumé en 2-3 phrases
2. Configuration minimale dans la réponse
3. Configuration complète dans artifact
4. Lien vers documentation détaillée

**Question sur bug :**
1. Diagnostic en bullet points
2. Solution recommandée
3. Code de correction dans artifact
4. Tests de validation

**Question sur architecture :**
1. Diagramme ASCII simple
2. Explication des flux principaux
3. Lien vers documentation détaillée
4. Exemple d'utilisation

## Application au projet Open Wearables

### Modules à documenter

1. **backend** → `.claude/summaries/backend.md`
2. **frontend** → `.claude/summaries/frontend.md`
3. **auth** → `.claude/summaries/auth.md`
4. **oauth** → `.claude/summaries/oauth.md`
5. **database** → `.claude/summaries/database.md`
6. **deployment** → `.claude/summaries/deployment.md`

### Ordre de création

1. ARCHITECTURE.md (vue globale)
2. Summaries de chaque module
3. Guides détaillés (OAUTH_FLOWS, API_INTEGRATION)
4. Documentation d'intégration EKYGAI

### Commandes Claude Code
````bash
# Créer tous les résumés
"Crée les fichiers summaries pour tous les modules en suivant TOKEN_OPTIMIZATION.md"

# Vérifier l'optimisation
"Analyse TOKEN_OPTIMIZATION.md et identifie les opportunités d'amélioration"

# Documenter un flux spécifique
"Documente le flux OAuth Garmin en suivant la structure hiérarchique"
````