# 📚 Passe-Livre

## 🇫🇷 Version Française

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

---

## 🇬🇧 English Version

A web application to scan and share your bookshelf. Take a photo of your shelves and AI automatically identifies your books!

### ✨ Features

- 📷 **Smart Scan** - Analyze a photo of your bookshelf with GPT-4 Vision
- 🎨 **Automatic Covers** - Cover retrieval via Open Library
- 🔄 **Flip Cards** - Flip cards to see the summary
- 📚 **Shelf Mode** - Alternative bookshelf-style view
- 🔍 **Filters** - Search by title, author, genre and status

### 🚀 Getting Started

#### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- An OpenAI API key

#### Installation

```bash
# Clone the repo
git clone https://github.com/guillaumebdx/book-platform.git
cd book-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configuration

Open the `.env` file and add your OpenAI API key:

```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key
```

> 💡 You can get an API key at [platform.openai.com](https://platform.openai.com/api-keys)

#### Start

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### 🛠️ Tech Stack

- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **OpenAI GPT-4o** - Image analysis
- **Open Library API** - Book covers

### 📝 Usage

1. Launch the application
2. Upload a photo of your bookshelf
3. Wait for analysis (scan effect)
4. Browse your books in grid or shelf mode
5. Click "See summary" to flip a card

### 📄 License

MIT
