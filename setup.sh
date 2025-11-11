#!/bin/bash

echo "🚀 GachaActu - Setup Script"
echo "============================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm n'est pas installé${NC}"
    echo "Installer pnpm avec: npm install -g pnpm"
    exit 1
fi

# Vérifier si Docker est installé (optionnel)
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker n'est pas installé (optionnel pour dev)${NC}"
fi

echo -e "${GREEN}✓${NC} pnpm trouvé"
echo ""

# Étape 1: Copier .env si n'existe pas
echo "📋 Étape 1/6: Configuration des variables d'environnement"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env créé depuis .env.example"
    echo -e "${YELLOW}⚠️  IMPORTANT: Éditez .env pour configurer APP_KEY et les mots de passe${NC}"
else
    echo -e "${YELLOW}⚠️${NC} .env existe déjà, ignoring..."
fi
echo ""

# Étape 2: Installation des dépendances
echo "📦 Étape 2/6: Installation des dépendances"
pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dépendances installées"
else
    echo -e "${RED}❌ Échec de l'installation${NC}"
    exit 1
fi
echo ""

# Étape 3: Générer APP_KEY pour l'API
echo "🔑 Étape 3/6: Génération de l'APP_KEY"
cd apps/api
if [ -f ../../.env ]; then
    # Générer une nouvelle clé
    APP_KEY=$(node ace generate:key --show)
    if [ $? -eq 0 ]; then
        # Remplacer dans le fichier .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/APP_KEY=.*/APP_KEY=$APP_KEY/" ../../.env
        else
            # Linux
            sed -i "s/APP_KEY=.*/APP_KEY=$APP_KEY/" ../../.env
        fi
        echo -e "${GREEN}✓${NC} APP_KEY générée et configurée"
    else
        echo -e "${YELLOW}⚠️${NC} Impossible de générer APP_KEY automatiquement"
        echo "Exécutez manuellement: cd apps/api && node ace generate:key"
    fi
else
    echo -e "${RED}❌ Fichier .env introuvable${NC}"
fi
cd ../..
echo ""

# Étape 4: Choix du mode
echo "🎯 Étape 4/6: Choix du mode de développement"
echo "1) Mode développement local (sans Docker)"
echo "2) Mode production avec Docker"
read -p "Choisissez (1 ou 2): " mode_choice
echo ""

if [ "$mode_choice" = "1" ]; then
    echo "🔧 Configuration en mode développement local"
    echo ""

    # Vérifier si PostgreSQL et Redis sont disponibles
    echo "⚠️  Assurez-vous que PostgreSQL et Redis sont démarrés localement"
    echo "   PostgreSQL: localhost:5432"
    echo "   Redis: localhost:6379"
    echo ""
    read -p "PostgreSQL et Redis sont-ils démarrés ? (y/n): " services_ready

    if [ "$services_ready" != "y" ]; then
        echo -e "${YELLOW}Démarrez vos services et relancez ce script${NC}"
        exit 0
    fi

    # Étape 5: Migrations
    echo "🗄️  Étape 5/6: Exécution des migrations"
    cd apps/api
    node ace migration:run
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Migrations exécutées"
    else
        echo -e "${RED}❌ Échec des migrations${NC}"
        exit 1
    fi
    cd ../..
    echo ""

    # Étape 6: Seeders
    echo "🌱 Étape 6/6: Exécution des seeders"
    cd apps/api
    node ace db:seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Seeders exécutés"
    else
        echo -e "${YELLOW}⚠️${NC} Échec des seeders (peut être normal si déjà exécutés)"
    fi
    cd ../..
    echo ""

    echo -e "${GREEN}✅ Setup terminé !${NC}"
    echo ""
    echo "🚀 Pour démarrer l'application:"
    echo "   pnpm dev"
    echo ""
    echo "📍 URLs:"
    echo "   API:     http://localhost:3333"
    echo "   Web:     http://localhost:3000"
    echo "   Admin:   http://localhost:3000/admin/login"

elif [ "$mode_choice" = "2" ]; then
    echo "🐳 Configuration en mode Docker"
    echo ""

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker n'est pas installé${NC}"
        exit 1
    fi

    echo "🏗️  Étape 5/6: Build des images Docker"
    docker compose build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Images Docker construites"
    else
        echo -e "${RED}❌ Échec du build Docker${NC}"
        exit 1
    fi
    echo ""

    echo "🚀 Étape 6/6: Démarrage des services"
    docker compose up -d
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Services démarrés"
    else
        echo -e "${RED}❌ Échec du démarrage${NC}"
        exit 1
    fi
    echo ""

    echo "⏳ Attente du démarrage complet (20s)..."
    sleep 20
    echo ""

    echo "🗄️  Exécution des migrations et seeders"
    docker compose exec api node ace migration:run --force
    docker compose exec api node ace db:seed
    echo ""

    echo -e "${GREEN}✅ Setup terminé !${NC}"
    echo ""
    echo "📍 URLs:"
    echo "   Site:    http://localhost"
    echo "   API:     http://localhost/api"
    echo "   Admin:   http://localhost/admin/login"
    echo ""
    echo "📊 Commandes utiles:"
    echo "   make logs        - Voir les logs"
    echo "   make down        - Arrêter les services"
    echo "   make restart     - Redémarrer"

else
    echo -e "${RED}❌ Choix invalide${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Tout est prêt !${NC}"
