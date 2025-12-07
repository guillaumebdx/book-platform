# 📚 Passe-Livre

Application web pour scanner et partager votre bibliothèque. Prenez une photo de vos étagères et l'IA identifie automatiquement vos livres !

## ✨ Fonctionnalités

- 📷 **Scan intelligent** - Analysez une photo de votre bibliothèque avec GPT-4 Vision
- 🎨 **Couvertures automatiques** - Récupération des couvertures via Open Library
- 🔄 **Flip cards** - Retournez les cartes pour voir le résumé
- 📚 **Mode étagère** - Vue alternative façon bibliothèque
- 🔍 **Filtres** - Recherche par titre, auteur, genre et statut

## 🚀 Lancer le projet

### Prérequis

- [Node.js](https://nodejs.org/) (v20 ou supérieur)
- Une clé API OpenAI

### Installation

```bash
# Cloner le repo
git clone https://github.com/guillaumebdx/book-platform.git
cd book-platform

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
```

### Configuration

Ouvrez le fichier `.env` et ajoutez votre clé API OpenAI :

```env
VITE_OPENAI_API_KEY=sk-votre-cle-api-openai
```

> 💡 Vous pouvez obtenir une clé API sur [platform.openai.com](https://platform.openai.com/api-keys)

### Démarrage

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

## 🛠️ Technologies

- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **OpenAI GPT-4o** - Analyse d'images
- **Open Library API** - Couvertures de livres

## 📝 Utilisation

1. Lancez l'application
2. Uploadez une photo de votre bibliothèque
3. Attendez l'analyse (effet de scan)
4. Parcourez vos livres en mode grille ou étagère
5. Cliquez sur "Voir le résumé" pour retourner une carte

## 📄 Licence

MIT
