# API AssurMoi – Gestion des sinistres

## 📌 Description

Cette API permet de gérer les sinistres d’une compagnie d’assurance automobile.
Elle couvre la gestion des utilisateurs, assurés, contrats, véhicules, sinistres, dossiers et documents.

---

## 🚀 Lancer le projet

```bash
docker compose up -d
```

L’API sera disponible sur :

```
http://localhost:3000
```

---

## 📚 Documentation Swagger

La documentation interactive de l’API est disponible ici :

👉 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🧪 Collection Postman

Toutes les routes sont testables via Postman :

👉 [https://documenter.getpostman.com/view/40393341/2sBXikoBkJ](https://documenter.getpostman.com/view/40393341/2sBXikoBkJ)

---

## 🔐 Authentification

L’API utilise :

* JWT (Bearer Token)
* Authentification à 2 facteurs (2FA)

### 🔑 Comment se connecter

#### 1. Faire le login

```http
POST /api/auth/login
```

Body :

```json
{
  "email": "test.test@test.fr",
  "mot_de_passe": "Test123456@"
}
```

👉 Réponse :

```json
{
  "requires_2fa": true,
  "user_id": 1,
  "code_demo": "123456"
}
```

⚠️ Le champ `code_demo` est utilisé pour simuler le code 2FA.

---

#### 2. Vérifier le code 2FA

```http
POST /api/auth/verify-2fa
```

Body :

```json
{
  "user_id": 1,
  "code": "123456"
}
```

👉 Réponse :

```json
{
  "token": "xxxxx"
}
```

---

#### 3. Utiliser le token

Ajouter dans les headers de chaque requête :

```
Authorization: Bearer VOTRE_TOKEN
```

---

## 🧩 Fonctionnalités principales

* Gestion des utilisateurs (admin, gestionnaire, etc.)
* Gestion des assurés
* Gestion des contrats
* Gestion des véhicules
* Gestion des sinistres
* Gestion des dossiers de prise en charge
* Gestion des documents liés aux sinistres/dossiers

---

## 🔐 Sécurité

* Authentification JWT
* Middleware de contrôle d’accès par rôle
* Protection des routes sensibles

---

## 🔑 Compte de test (Admin)

Pour faciliter les tests, un compte administrateur est disponible :

* Email : [test.test@test.fr](mailto:test.test@test.fr)
* Mot de passe : Test123456@
