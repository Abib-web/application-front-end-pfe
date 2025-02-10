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
   git clone https://github.com/votre-utilisateur/votre-projet.git
   cd votre-projet
