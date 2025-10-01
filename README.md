# 📦 Gestion de Produits avec Authentification

Application MERN (MongoDB, Express, React, Node.js) permettant :
- L'inscription et la connexion d’utilisateurs (avec JWT).
- L’ajout, la modification, la suppression et la consultation de produits personnels.
- Une interface React moderne avec Material UI, gestion de session via `localStorage`.
- 📡 Notifications en temps réel grâce à **WebSocket (Socket.IO)**.
- 🗂️ État global géré avec **Redux Toolkit**.


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
- **Redux Toolkit** :
  - Centralise l’état de l’application (utilisateur connecté, liste des produits).
  - Synchronise automatiquement les produits entre toutes les pages.
  - Gère les actions déclenchées par WebSocket (ajout, modification, suppression) pour que l’interface se mette à jour en temps réel partout.
- **Notifications temps réel** : affichées via MUI `Snackbar`/`Alert`.

### Backend (Express / MongoDB + Socket.IO)
- **Authentification sécurisée** avec `bcrypt` et `jsonwebtoken`.
- **Middleware requireAuth** : protège toutes les routes de produits.
- **CRUD Produits** :
  - `POST /api/product` → créer un produit.
  - `GET /api/product` → récupérer tous les produits.
  - `GET /api/product/:id` → récupérer un produit spécifique.
  - `PATCH /api/product/:id` → modifier un produit.
  - `DELETE /api/product/:id` → supprimer un produit.
- **CRUD Utilisateurs** :
  - `POST /api/users/register` → inscription.
  - `POST /api/users/login` → connexion (retourne un token JWT).
- **WebSocket (Socket.IO)** :
  - Lors de la **création**, **modification** ou **suppression** d’un produit, le serveur émet un événement (`productCreated`, `productUpdated`, `productDeleted`) à tous les clients connectés.
  - Chaque client affiche une notification avec le nom de l’utilisateur (username) ayant réalisé l’action.

---

## 📡 Notifications en temps réel (WebSocket)

Le projet utilise **Socket.IO** pour garder les produits synchronisés entre tous les utilisateurs connectés.  
Grâce à **Redux Toolkit**, les événements reçus sont directement dispatchés dans le store, ce qui met à jour toutes les pages automatiquement.

Exemple :
- Un utilisateur modifie un produit → le serveur émet `productUpdated`.
- Le client reçoit l’événement et exécute : 
  ```js
  dispatch(upsertProduct(product));
  ```

Le produit est mis à jour dans le store Redux → la table des produits se met à jour instantanément pour tout le monde.

- Côté **serveur**, après une action CRUD sur un produit, un événement est émis :
  ```js
  io.emit('productUpdated', {
    product: updatedProduct,
    actor: { id: req.user.id, username: req.user.username }
  });```

- Côté **client**, l’application React écoute ces événements :

```js
socket.on('productUpdated', ({ product, actor }) => {
  setProducts(prev => prev.map(p => (p._id === product._id ? product : p)));
  setMsg(`🟡 ${actor.username} a modifié « ${product.name} »`);
});
```
Ainsi, toutes les sessions actives restent synchronisées en temps réel et affichent qui a effectué la modification.

## 📂 Structure du projet
```
├── Client/
│ ├── App.js
│ ├── pageAcceuil.js
│ ├── addProduct.js
│ ├── editProduct.js
│
├── docs/
│ ├── affichage_produits.png
│ ├── ajouter_produit.png
│ ├── bdd_mongoDB.png
│ ├── ecran_acceuil.png
│ ├── modifier_produit.png
│ ├── page_acceuil.png
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
├── swagger/
│ ├── index.html
│ ├── css/
│ │ ├── swagger-ui.css
│ ├── js/
│ │ ├── swagger-initializer.js
│ │ ├── swagger-ui-bundle.js
│ │ ├── swagger-ui-es-bundle-core.js
│ │ ├── swagger-ui-es-bundle.js
│ │ ├── swagger-ui-standalone-preset.js
│ │ ├── swagger-ui.js
│ │ ├── swagger-ui.js
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

### Modifier des produits

![Produits screenshot](./docs/modifier_produit.png)

### Notification avec socket.io

![Produits screenshot](./docs/notification_socket_io.png)

### Base de données MongoDB

![Produits screenshot](./docs/bdd_mongoDB.png)

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

- Mots de passe hashés avec bcryptjs.
- Authentification protégée avec JWT.
- Routes API sécurisées : un token valide est nécessaire pour accéder aux produits.

## ✨ Qualité du code

L’ensemble du code respecte la norme définie par **ESLint**, garantissant :
- une cohérence de style (indentation, guillemets, point-virgule, etc.),
- la détection des variables inutilisées ou non définies,
- le respect des bonnes pratiques modernes côté **frontend (React)** et **backend (Node/Express)**.

Tu peux exécuter le linter pour vérifier ou corriger automatiquement :

```bash
# côté frontend
cd Client
npx eslint "src/**/*.{js,jsx}" --fix

# côté backend
cd Server
npx eslint "**/*.js" --fix
```

## 📖 Documentation API (Swagger)

Le projet inclut une documentation interactive de l’API grâce à **Swagger UI**.  
Elle permet de tester directement les endpoints disponibles (CRUD Produits et Utilisateurs).

### Accéder à la documentation

Une fois le backend lancé, ouvre ton navigateur sur :  
👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Tu y trouveras :
- Les routes d’authentification (`/api/users/register`, `/api/users/login`).
- Les routes Produits (`/api/product`, `/api/product/:id`).
- Les détails des paramètres, schémas et réponses.

Swagger se base sur le fichier `swagger/swagger.json` et est servi par le backend Express.

## 📌 Améliorations possibles

Validation avancée côté frontend (prix > 0, note entre 0–5, etc.).
Pagination, tri et recherche sur la liste des produits.
Déploiement (Render, Netlify, Vercel, etc.).
