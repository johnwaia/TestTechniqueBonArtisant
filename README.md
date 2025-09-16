# 📇 Gestion de Contacts avec Authentification

Application MERN (MongoDB, Express, React, Node.js) permettant :
- L'inscription et connexion d’utilisateurs (avec JWT).
- L’ajout, la modification, la suppression et la consultation de contacts personnels.
- Une interface simple en React avec gestion de session via `localStorage`.

---

## 🚀 Fonctionnalités

### Frontend (React)
- **Page d’authentification** : inscription + connexion utilisateur.
- **Page d’accueil** : bienvenue + gestion des contacts.
- **Ajout de contact** : formulaire avec nom, prénom, téléphone.
- **Modification de contact** : édition des informations existantes.
- **Suppression de contact** : retrait immédiat de la liste.
- **Déconnexion** : suppression du token JWT du `localStorage`.

### Backend (Express / MongoDB)
- **Authentification sécurisée** avec `bcrypt` et `jsonwebtoken`.
- **Middleware requireAuth** : protège toutes les routes de contacts.
- **CRUD contacts** :
  - `POST /api/contact` → créer un contact.
  - `GET /api/contact` → récupérer tous les contacts de l’utilisateur.
  - `PATCH /api/contact/:id` → modifier un contact.
  - `DELETE /api/contact/:id` → supprimer un contact.
  - `GET /api/contact/:id` → récupérer un contact spécifique.
- **CRUD utilisateurs** :
  - `POST /api/users/register` → inscription.
  - `POST /api/users/login` → connexion (retourne un token JWT).

---

## 📂 Structure du projet
```
├── Client/client
│ ├── App.js
│ ├── pageAcceuil.js
│ ├── addContact.js
│ ├── editContact.js
│
├── server/
│ ├── server.js
│ ├── routes/
│ │ ├── users.js
│ │ ├── contacts.js
│ ├── models/
│ │ ├── user.js
│ │ ├── contact.js
│ ├── middleware/
│ │ ├── requireAuth.js
│ ├── .env
│
└── README.md
``` 

---

## ⚙️ Installation & Lancement

### 1. Cloner le projet
```bash
git clone
```

### 2. Lancer le server
```bash
cd backend
npm install
```

#### Créer un fichier .env à la racine du backend avec :
```
MONGO_URI=mongodb://localhost:27017/contactapp
JWT_SECRET=tonsecretjwt
PORT=5000
```
## Lancer l’application

### Backend

Depuis le dossier backend :
```bash
npm start
```

Par défaut, le serveur écoute sur http://localhost:5000.

### Frontend

Depuis la racine du projet :
```
npm start

```

L’application s’ouvre sur http://localhost:3000
.

## 🔒 Sécurité

Les mots de passe sont hashés avec bcryptjs.

L’authentification est protégée avec JWT.

Les routes API nécessitent un token valide pour accéder aux contacts.

## 📌 Améliorations possibles

Validation plus avancée côté frontend (format téléphone, etc.).

Ajout de tests unitaires (Jest / Mocha).

Pagination et recherche dans la liste des contacts.

Déploiement (Heroku, Render, Vercel, etc.).

## 👨‍💻 Auteur

Projet développé à titre d’apprentissage (React, Node.js, Express, MongoDB).




