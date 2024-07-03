# Projet Inventaire

Ce projet est un site web de gestion d'inventaire. Les fichiers nécessaires pour lancer le site web ainsi que la structure de la base de données sont inclus dans ce projet.

## Contenu de la Clé USB

- **Site Web** : Les fichiers du site web sont inclus dans le répertoire `htdocs`.
- **Structure de la Base de Données** : Le fichier SQL pour la structure de la base de données est inclus dans le répertoire `database`.

## Prérequis

- **XAMPP** : Assurez-vous que XAMPP est installé sur votre machine. Vous pouvez le télécharger depuis [Apache Friends](https://www.apachefriends.org/index.html).
- **Node.js** : Assurez-vous que Node.js est installé sur votre machine. Vous pouvez le télécharger depuis [Node.js](https://nodejs.org/).
- **Node.js** : Télécharger les library multer et csv-parser avec la commande npm install multer/csv-parser, si cela ne fonctionne pas faite le manuellement

## Installation

1. **Copier les fichiers** :
    - Copiez le dossier inventaire/inventaire de la clé USB dans le répertoire `C:\xampp\htdocs\inventaire`.

2. **Configurer la base de données** :
    - Ouvrez phpMyAdmin via XAMPP (généralement accessible via `http://localhost/phpmyadmin`).
    - Crée la base de donnés portant le nom de inventaire2
    - Importez le fichier SQL `database/inventaire2.sql` pour créer la base de données et les tables nécessaires.

## Lancer le Site Web

### 1. Démarrer XAMPP

- Ouvrez XAMPP Control Panel.
- Démarrez les services **Apache** et **MySQL**.

### 2. Exécuter le Script Batch

Pour lancer le site web et le serveur Node.js, exécutez le script batch `start.bat`. **Il est important d'exécuter ce script en tant qu'administrateur** pour éviter les problèmes de permissions.

#### Instructions pour exécuter le script en tant qu'administrateur :

1. Faites un clic droit sur le fichier `start.bat`.
2. Sélectionnez "Exécuter en tant qu'administrateur".
