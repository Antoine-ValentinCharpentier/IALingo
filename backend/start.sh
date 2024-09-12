#!/bin/sh

# Fonction pour vérifier la disponibilité de la commande Ollama
check_health() {
  if ollama --help > /dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Démarrer Ollama
echo "Starting Ollama service..."
ollama serve &

# Attendre que le service Ollama soit prêt
echo "Waiting for Ollama service to be healthy..."
while ! check_health; do
  echo "Ollama service is not yet available. Waiting..."
  sleep 5
done

# Une fois que le service est sain, exécuter/download le modèle
echo "Ollama service is healthy. Running model..."
ollama run llama3.1 &


# Garder le conteneur actif
wait
