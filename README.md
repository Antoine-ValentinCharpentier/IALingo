﻿# IALingo

## Overview

IALingo est un projet ambitieux qui vise à révolutionner l'apprentissage des langues en exploitant les dernières avancées en intelligence artificielle. Notamment, en utilisant un modèle de langage (LLM) pour générer des exercices/cours. 

À ce jour, les fonctionnalités mises en place sont les suivantes :
- Questionnaires de vocabulaire (trouver la traduction d'un mot).
- Questionnaires de compréhension de texte.
- Authentification via Google et authentification locale gérées simultanément.

## Fonctionnalités à venir

De nombreuses fonctionnalités sont prévues pour ce projet, notamment :
- Sélection de phrases ou de mots pour compléter des lacunes dans une conversation.
- Conversations avec un chatbot capable de corriger les erreurs commises lors des échanges.
- Evaluation d'expression écrite
- Questionnaires de compréhension audio (texte généré puis converti en synthèse vocale).
- Simulations de conversations téléphoniques avec l'IA.
- Établissement de programmes d'apprentissage personnalisés.
- Génération de cours.
- Demandes d'informations approfondies sur les cours proposés.
- Génération de QCM personnalisés pour les utilisateurs.

## Prérequis
Docker Desktop doit être installé et lancé.

Avoir Configurer l'authentification via Google à partir de la console Google Cloud :
   - Créez un projet sur Google Cloud Console.
   - Activez l'API d’authentification Google.
   - Configurez les identifiants OAuth 2.0 :
     - Dans le menu de gauche, sélectionnez **API et services > Identifiants**.
     - Cliquez sur **Créer des identifiants** et sélectionnez **ID client OAuth**.
     - Choisissez le type d'application **Application Web**.
     - Remplissez les informations requises. Notamment, ajoutez les éléments suivants :
       - **URL de redirection autorisées** : `http://localhost:3000`
       - **Origines JavaScript autorisées** : `http://localhost:3000` et `http://localhost`
     - Récupérez les identifiants :
       - **ID client** : utilisé pour identifier votre application auprès de Google.
       - **Secret client** : utilisé pour authentifier les requêtes de votre application.
   - Configurez l'écran de consentement en renseignant les adresses e-mail des utilisateurs de test autorisés à se connecter.

## Mise en place
1. Clonez le projet :
   ```bash
   git clone git@github.com:Antoine-ValentinCharpentier/IALingo.git
   cd IALingo
   ```

2. Créez un fichier `.env` à la racine du projet,  similaire à l'exemple fourni dans `.env.example`, en y ajoutant les variables d'environnement suivantes :
   - `GOOGLE_CLIENT_ID` : L'ID client du projet Google, utilisé pour identifier l'application lors de l'authentification via Google.
   - `GOOGLE_CLIENT_SECRET` : Le secret client associé à l'ID client, nécessaire pour sécuriser les communications entre l'application et les serveurs Google.
   - `AUTH_SECRET_KEY` : Clé utilisée pour signer les tokens JWT lors du processus d'authentification
4. Construisez et démarrez les conteneurs Docker :
   ```bash
   docker compose build
   docker compose up
   ```

5. Ouvrez votre navigateur et accédez à l'URL suivante : [http://localhost:3000](http://localhost:3000).

## Remarques
Vous pouvez accéder à la documentation de l'API backend à l'URL suivante : [http://localhost:8000/docs](http://localhost:8000/docs).

Actuellement, le modèle utilisé est llama 3.1. Si vous souhaitez utiliser un autre modèle proposé par Ollama, vous pouvez spécifier son nom dans le fichier `backend/config.py`, en modifiant la variable `OLLAMA_MODEL_NAME`.

Si chaque services de l'application est hébergé sur des serveurs différents, assurez-vous de mettre à jour les URL correspondantes dans les variables d'environnement définies dans le fichier `docker-compose` du projet.
