import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Production: No fake YouTube video data
    // YouTube videos will be added manually through the admin interface
    console.log(
      '✅ YouTube video seeder skipped (production mode - add videos via admin interface)'
    )

    /* DEV ONLY: Uncomment for development seeding
    const genshin = await Game.findByOrFail('name', 'Genshin Impact')
    const honkai = await Game.findByOrFail('name', 'Honkai Star Rail')

    await YoutubeVideo.updateOrCreateMany('videoId', [
      {
        videoId: 'dQw4w9WgXcQ',
        title: 'Guide Complet Genshin Impact 2025 - Tout ce qu\'il faut savoir',
        description:
          'Un guide complet pour débuter sur Genshin Impact en 2025. Tips, astuces et conseils pour progresser rapidement.',
        channelTitle: 'Gacha Master',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        publishedAt: DateTime.fromISO('2025-01-10'),
        isActive: true,
        viewCount: 15000,
        order: 1,
        gameId: genshin.id,
      },
      {
        videoId: 'abc123xyz',
        title: 'Tier List Honkai Star Rail - Meilleurs Personnages',
        description:
          'Tier list complète des personnages de Honkai Star Rail avec analyses détaillées.',
        channelTitle: 'HSR Expert',
        thumbnail: 'https://img.youtube.com/vi/abc123xyz/maxresdefault.jpg',
        publishedAt: DateTime.fromISO('2025-01-15'),
        isActive: true,
        viewCount: 12000,
        order: 2,
        gameId: honkai.id,
      },
      {
        videoId: 'xyz789abc',
        title: 'Top 10 Équipes Genshin Impact - Meta 2025',
        description:
          'Les meilleures compositions d\'équipes pour dominer l\'Abysse Spiral en 2025.',
        channelTitle: 'Gacha Master',
        thumbnail: 'https://img.youtube.com/vi/xyz789abc/maxresdefault.jpg',
        publishedAt: DateTime.fromISO('2025-01-20'),
        isActive: true,
        viewCount: 18000,
        order: 3,
        gameId: genshin.id,
      },
      {
        videoId: 'def456ghi',
        title: 'Honkai Star Rail - Guide Farm Optimal',
        description: 'Comment optimiser votre farm de matériaux et d\'équipements.',
        channelTitle: 'HSR Expert',
        thumbnail: 'https://img.youtube.com/vi/def456ghi/maxresdefault.jpg',
        publishedAt: DateTime.fromISO('2025-01-18'),
        isActive: true,
        viewCount: 9000,
        order: 4,
        gameId: honkai.id,
      },
      {
        videoId: 'ghi789jkl',
        title: 'Nouveautés Genshin Impact 4.5 - Analyse Complète',
        description: 'Tout sur la version 4.5 : nouveaux personnages, événements et contenu.',
        channelTitle: 'Gacha News',
        thumbnail: 'https://img.youtube.com/vi/ghi789jkl/maxresdefault.jpg',
        publishedAt: DateTime.fromISO('2025-01-22'),
        isActive: true,
        viewCount: 21000,
        order: 5,
        gameId: genshin.id,
      },
    ])
    */
  }
}
