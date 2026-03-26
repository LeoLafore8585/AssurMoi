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

### Étapes :

1. `/auth/login`
2. `/auth/verify-2fa`
3. Utiliser le token dans les requêtes :

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

## 🛠️ Stack technique

* Node.js / Express
* Sequelize (ORM)
* MariaDB
* Docker

---

## 👨‍💻 Auteur

Projet réalisé dans le cadre d’un exercice de développement M2.
