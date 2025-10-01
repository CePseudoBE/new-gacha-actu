import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Article from '#models/article'
import Game from '#models/game'
import ArticleCategory from '#models/article_category'
import Tag from '#models/tag'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const genshin = await Game.findByOrFail('name', 'Genshin Impact')
    const honkai = await Game.findByOrFail('name', 'Honkai Star Rail')
    const newsCategory = await ArticleCategory.findByOrFail('name', 'Actualités')
    const guideCategory = await ArticleCategory.findByOrFail('name', 'Guides')
    const tierListCategory = await ArticleCategory.findByOrFail('name', 'Tier Lists')

    // Article 1: Genshin Impact Tier List
    const article1 = await Article.updateOrCreate(
      { slug: 'tier-list-genshin-impact-meilleurs-personnages-2025' },
      {
        title: 'Tier List Genshin Impact : Les Meilleurs Personnages de 2025',
        summary:
          'Découvrez le classement complet des personnages de Genshin Impact mis à jour pour 2025. Analysez les meta picks et optimisez votre équipe.',
        author: 'Équipe Anime Gacha Pulse',
        publishedAt: DateTime.fromISO('2025-01-15'),
        imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc',
        content: `# Introduction

La meta de Genshin Impact évolue constamment avec chaque nouvelle version. Ce tier list compile les meilleures unités de janvier 2025.

## Tier S+ : Les Indispensables

### Neuvillette
Le meilleur DPS Hydro du jeu. Sa capacité à infliger des dégâts massifs en zone tout en restant mobile en fait un choix premium.

### Furina
Support/Sub-DPS polyvalent qui booste l'ensemble de l'équipe. Essentiel pour maximiser les dégâts.

## Tier S : Excellents Choix

### Nahida
La meilleure applicatrice Dendro. Indispensable pour les compositions Bloom et Hyperbloom.

### Kazuha
Support anemo qui augmente les dégâts élémentaires. Fonctionne dans presque toutes les équipes.

## Conclusion

Priorisez les personnages Tier S+ pour votre pity si vous souhaitez optimiser votre roster.`,
        metaDescription:
          'Tier list complète Genshin Impact 2025 avec analyses détaillées des meilleurs personnages DPS, Support et Sub-DPS.',
        readingTime: 8,
        isPopular: true,
        gameId: genshin.id,
        categoryId: tierListCategory.id,
      }
    )

    // Article 2: Honkai Star Rail News
    const article2 = await Article.updateOrCreate(
      { slug: 'honkai-star-rail-version-2-8-nouveautes' },
      {
        title: 'Honkai Star Rail Version 2.8 : Toutes les Nouveautés',
        summary:
          'La version 2.8 arrive avec de nouveaux personnages, événements exclusifs et mécaniques de gameplay. Voici tout ce qu\'il faut savoir.',
        author: 'Marc Dubois',
        publishedAt: DateTime.fromISO('2025-01-20'),
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        content: `# Version 2.8 : Une Mise à Jour Majeure

HoYoverse dévoile une mise à jour massive pour Honkai Star Rail.

## Nouveaux Personnages

### Jade (5★ Quantum - Érudition)
Un personnage orienté follow-up attacks avec des capacités de boost d'équipe uniques.

### Argenti Rerun
Le cavalier esthète revient dans une bannière limitée. Excellent DPS Physique mono-cible.

## Nouveaux Événements

- **Divergent Universe Extension** : Nouveaux mondes à explorer
- **Pure Fiction Season 8** : Nouvelle rotation avec focus AOE
- **Gift of Odyssey** : Récompenses de connexion quotidienne

## Équilibrage

Plusieurs personnages reçoivent des ajustements :
- **Seele** : Buff léger de ses multiplicateurs
- **Jing Yuan** : Amélioration de la génération d'énergie

## Conclusion

La version 2.8 promet d'enrichir l'expérience avec du contenu varié. Préparez vos Stellar Jades !`,
        metaDescription:
          'Découvrez toutes les nouveautés de la version 2.8 de Honkai Star Rail : personnages, événements et équilibrage.',
        readingTime: 6,
        isPopular: true,
        gameId: honkai.id,
        categoryId: newsCategory.id,
      }
    )

    // Article 3: Genshin Guide Débutant
    const article3 = await Article.updateOrCreate(
      { slug: 'guide-debutant-genshin-impact-reroll-premiers-pas' },
      {
        title: 'Guide Débutant Genshin Impact : Reroll et Premiers Pas',
        summary:
          'Nouveau sur Genshin Impact ? Ce guide complet vous accompagne du tutoriel aux premiers Abysses avec conseils de reroll et progression optimale.',
        author: 'Sophie Martin',
        publishedAt: DateTime.fromISO('2025-01-10'),
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420',
        content: `# Débuter sur Genshin Impact

Bienvenue dans le monde de Teyvat ! Ce guide vous aidera à bien démarrer.

## Faut-il Reroll ?

Le reroll n'est plus vraiment nécessaire en 2025. Le jeu offre :
- Beaucoup de primogems gratuites
- Des personnages 4★ très viables
- Un système de pity généreux

### Si vous voulez quand même reroll

Ciblez ces personnages sur la bannière standard :
- Diluc (DPS Pyro)
- Jean (Healer/Support)
- Mona (Support Hydro)

## Progression Optimale

### Niveau d'Aventure 1-20
- Suivez l'histoire principale
- Activez tous les téléporteurs
- Collectez les Anemoculus/Geoculus

### Niveau d'Aventure 20-35
- Montez vos personnages principaux à niveau 40
- Farmez les donjons pour les matériaux d'ascension
- Commencez les quêtes d'Archontes

## Team Compositions Débutant

### Team F2P Viable
- Anemo Traveler (DPS/Support)
- Kaeya (Sub-DPS Cryo)
- Lisa (Applicatrice Electro)
- Barbara (Healer)

## Gestion des Ressources

**Primogems** : Gardez-les pour les bannières limitées que vous voulez vraiment.

**Resine** : Priorisez les donjons de talent et d'arme en early game.

## Conclusion

Prenez votre temps, explorez et profitez de l'aventure !`,
        metaDescription:
          'Guide complet pour débuter Genshin Impact : conseils de reroll, progression optimale et compositions d\'équipe pour débutants.',
        readingTime: 12,
        isPopular: false,
        gameId: genshin.id,
        categoryId: guideCategory.id,
      }
    )

    // Attach tags
    const tierListTag = await Tag.findByOrFail('name', 'Tier List')
    const metaTag = await Tag.findByOrFail('name', 'Meta')
    const nouveauteTag = await Tag.findByOrFail('name', 'Nouveauté')
    const guideDebutantTag = await Tag.findByOrFail('name', 'Guide Débutant')
    const rerollTag = await Tag.findByOrFail('name', 'Reroll')
    const patchNotesTag = await Tag.findByOrFail('name', 'Patch Notes')

    await article1.related('tags').sync([tierListTag.id, metaTag.id])
    await article2.related('tags').sync([nouveauteTag.id, patchNotesTag.id])
    await article3.related('tags').sync([guideDebutantTag.id, rerollTag.id])
  }
}
