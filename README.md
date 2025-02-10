# Application Front-end PFE

Dans le cadre de notre projet de fin d'études, nous avons développé un système de surveillance de la qualité de l'air. Une partie essentielle de ce système est une application web front-end réalisée avec **ReactJS**.

---

## Table des matières

- [Description du projet](#description-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Description du projet

Ce projet vise à surveiller la qualité de l'air à l'aide de capteurs déployés sur le terrain. L'application web permet de :

- **Visualiser en temps réel** les mesures de qualité de l'air.
- **Afficher l'historique des mesures** sous forme de graphiques et de tableaux.
- **Recevoir des alertes et notifications** lorsque certains seuils sont dépassés.
- **Gérer les utilisateurs, les rôles et la configuration du système** via une interface d'administration.

L'application front-end a été réalisée avec **ReactJS** et intègre plusieurs bibliothèques telles que **Chart.js** (via react-chartjs-2) pour la visualisation des courbes et **React Icons** pour les icônes.

---

## Fonctionnalités

- **Dashboard en temps réel :**
  - Affichage des niveaux actuels de divers gaz (CO, NO₂, PM2.5, PM10, Température, Humidité) avec des mises à jour dynamiques.

- **Alertes et notifications :**
  - Réception d'alertes lorsque les niveaux de polluants dépassent des seuils définis.
  - Chaque utilisateur reçoit ses propres notifications avec gestion de l'état de lecture.

- **Historique des mesures :**
  - Consultation des mesures historiques via des tableaux et des graphiques interactifs.

- **Interface d'administration :**
  - Gestion des utilisateurs, des rôles et de la configuration du système via une interface dédiée aux administrateurs.

- **Authentification sécurisée :**
  - Système de connexion avec gestion des rôles (utilisateur et administrateur) via Redux Toolkit.

---

## Technologies utilisées

- **ReactJS** – Pour la création de l'interface utilisateur.
- **Chart.js** (via react-chartjs-2) – Pour l'affichage des graphiques.
- **React Icons** – Pour l'intégration d'icônes.
- **Bootstrap** – Pour la mise en page et le design responsive.
- **Redux Toolkit** – Pour la gestion de l'état global (authentification, etc.).
- **Axios / fetchWrapper** – Pour les appels API.
- **Express** et **PostgreSQL** (backend) – Pour la gestion des données et la création des API.

---

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/Abib-web/application-front-end-pfe.git
   cd votre-projet
   ```
2. **Installer les dépendances :**

```
npm install
```
3. **Configurer l'environnement :**
Créez un fichier .env à la racine du projet et configurez les variables d'environnement nécessaires (par exemple, l'URL de l'API, le JWT_SECRET, etc.).

4. **Démarrer l'application :**

```
npm run dev
```
L'application sera accessible sur http://localhost:5173.

5. **Utilisation**
### Connexion :
Rendez-vous sur la page de connexion pour vous authentifier. Une fois connecté, vous serez redirigé vers le Dashboard.

### Dashboard :
Visualisez en temps réel les mesures de qualité de l'air, consultez l'historique des mesures et recevez des alertes.

### Administration :
Les utilisateurs ayant le rôle d'administrateur peuvent accéder à la page d'administration pour gérer les utilisateurs, les rôles et la configuration du système.

### Alertes :
Chaque utilisateur reçoit ses propres notifications. L'état de lecture est géré pour chaque utilisateur individuellement.

### Structure du projet
```
src/
├── components/
│   ├── Admin/
│   │   ├── UserList.jsx
│   │   ├── UserForm.jsx
│   │   ├── RoleList.jsx
│   │   ├── RoleForm.jsx
│   │   └── AdminLayout.jsx
│   ├── AlertLogs/
│   │   └── AlertsLogs.jsx
│   ├── Header/
│   │   └── Header.jsx
│   ├── NavBar/
│   │   └── NavBar.jsx
│   ├── RealTime/
│   │   ├── DeviceDetails.jsx
│   │   └── RealTimeDashboard.jsx
│   └── DeviceList/
│       └── DeviceList.jsx
├── pages/
│   ├── AdminPage.jsx
│   ├── Home.jsx
│   ├── FAQ.jsx
│   ├── Contact.jsx
│   ├── LoginPage.jsx
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Notifications.jsx
│   └── ... (autres pages)
├── api/
│   ├── userAPI.js
│   ├── alerts.js
│   └── ... (autres API)
├── store/
│   └── authSlice.js
└── App.jsx
```
## Contribution
Les contributions sont les bienvenues ! Pour contribuer :

Forkez le dépôt.

### Créez une branche pour votre fonctionnalité :

```
git checkout -b feature/ma-nouvelle-fonctionnalite
```
# Commitez vos changements :

```
git commit -am "Ajouter une nouvelle fonctionnalité"
```

### Poussez votre branche :
```
git push origin feature/ma-nouvelle-fonctionnalite
```
Ouvrez une Pull Request.

## Licence
Ce projet est sous licence MIT
