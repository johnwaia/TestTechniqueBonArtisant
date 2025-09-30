# 📦 Gestion de Produits avec Authentification

Application MERN (MongoDB, Express, React, Node.js) permettant :
- L'inscription et la connexion d’utilisateurs (avec JWT).
- L’ajout, la modification, la suppression et la consultation de produits personnels.
- Une interface React moderne avec Material UI, gestion de session via `localStorage`.

---

## 🚀 Fonctionnalités

### Frontend (React + Material UI)
- **Page d’authentification** : inscription + connexion utilisateur.
- **Page d’accueil** : bienvenue + gestion des produits.
- **Ajout de produit** : formulaire avec nom, type, prix, note, garantie, disponibilité.
- **Modification de produit** : édition des informations existantes.
- **Suppression de produit** : retrait immédiat de la liste.
- **Déconnexion** : suppression du token JWT du `localStorage`.
- **UI moderne avec Material UI** (AppBar, Button, Table, Alert, Snackbar…).

### Backend (Express / MongoDB)
- **Authentification sécurisée** avec `bcrypt` et `jsonwebtoken`.
- **Middleware requireAuth** : protège toutes les routes de produits.
- **CRUD Produits** :
  - `POST /api/product` → créer un produit.
  - `GET /api/product` → récupérer tous les produits de l’utilisateur.
  - `PATCH /api/product/:id` → modifier un produit.
  - `DELETE /api/product/:id` → supprimer un produit.
  - `GET /api/product/:id` → récupérer un produit spécifique.
- **CRUD Utilisateurs** :
  - `POST /api/users/register` → inscription.
  - `POST /api/users/login` → connexion (retourne un token JWT).

---

## 📂 Structure du projet
```
├── Client/
│ ├── App.js
│ ├── pageAcceuil.js
│ ├── addProduct.js
│ ├── editProduct.js
│
├── server/
│ ├── server.js
│ ├── routes/
│ │ ├── users.js
│ │ ├── products.js
│ ├── models/
│ │ ├── user.js
│ │ ├── product.js
│ ├── middleware/
│ │ ├── requireAuth.js
│ ├── .env
│
└── README.md
```

---

## Capture d'écran

### Page de connexion

![Login screenshot](./docs/ecran_acceuil.png)

### Page d’accueil

![Produits screenshot](./docs/page_acceuil.png)

### Afficher les Produits de l'utilisateur.

![Produits screenshot](./docs/affichage_produits.png)

### Ajouter des produits

![Produits screenshot](./docs/ajouter_produit.png)

## ⚙️ Installation & Lancement

### 1. Cloner le projet

```bash
git clone https://github.com/johnwaia/TestTechniqueBonArtisant.git
```

### 2. lancer le backend

```bash
cd server
npm install
npm start
```

#### Créer un fichier .env dans server :

ce sont les vrais variables d'environement pour pouvoir tester sans problème.
```bash
MONGO_URI=mongodb+srv://appuser:test12345678@cluster0.ccv4wnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=une_chaine_longue_et_secrete_change_moi
```

### 3.Lancer le frontend

```bash
cd Client
npm install
npm start
```

Par défaut :
Le serveur écoute sur http://localhost:5000
Le front est accessible sur http://localhost:3000

## 🔒 Sécurité

Mots de passe hashés avec bcryptjs.
Authentification protégée avec JWT.
Routes API sécurisées : un token valide est nécessaire pour accéder aux produits.

## 📌 Améliorations possibles

Validation avancée côté frontend (prix > 0, note entre 0–5, etc.).
Pagination, tri et recherche sur la liste des produits.
Déploiement (Render, Netlify, Vercel, etc.).
