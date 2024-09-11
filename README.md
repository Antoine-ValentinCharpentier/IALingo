# IALingo

## Overview

IALingo est un projet ambitieux qui vise à révolutionner l'apprentissage des langues en exploitant les dernières avancées en intelligence artificielle, notamment dans le domaine des modèles de langage (LLM). À ce jour, l'authentification via Google est la seule fonctionnalité mise en place.

## Fonctionnalités à venir

De nombreuses fonctionnalités sont prévues pour ce projet, parmi lesquelles :
- Génération de QCM personnalisés pour les utilisateurs.
- Conversations avec un chatbot capable de corriger les erreurs lors des discussions.
- Sélection de phrases ou de mots pour compléter des trous dans une conversation.
- Questionnaires de compréhension de texte ou d'audio (texte généré avec synthèse vocale).
- Simulations de conversations téléphoniques avec l'IA.
- Demandes d'informations approfondies sur des cours proposés.

## Prérequis
Docker Desktop doit être installé et lancé.

## Mise en place
1. Clonez le projet :
   ```bash
   git clone git@github.com:Antoine-ValentinCharpentier/IALingo.git
   cd IALingo
   ```

2. Créez un fichier `.env` à la racine du projet, contenant une variable `GOOGLE_CLIENT_ID` avec l'ID client de votre projet Google Developer utilisé pour l'authentification OAuth2. Ce fichier doit être similaire à l'exemple fourni dans `.env.example`.

3. Construisez et démarrez les conteneurs Docker :
   ```bash
   docker compose build
   docker compose up
   ```

4. Ouvrez votre navigateur et accédez à l'URL suivante : [http://localhost:3000](http://localhost:3000).

## Remarques
Vous pouvez accéder à la documentation de l'API backend à l'URL suivante : [http://localhost:8000/docs](http://localhost:8000/docs).
