import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Production: No fake game data
    // Games will be added manually through the admin interface
    console.log('✅ Game seeder skipped (production mode - add games via admin interface)')

    /* DEV ONLY: Uncomment for development seeding
    const genshin = await Game.updateOrCreate(
      { name: 'Genshin Impact' },
      {
        name: 'Genshin Impact',
        description:
          'Explorez le monde fantastique de Teyvat dans ce RPG d\'action en monde ouvert. Incarnez le Voyageur à la recherche de votre jumeau disparu et découvrez les secrets des Sept nations.',
        releaseDate: DateTime.fromISO('2020-09-28'),
        isPopular: true,
        officialSite: 'https://genshin.hoyoverse.com',
        wiki: 'https://genshin-impact.fandom.com',
      }
    )

    const honkai = await Game.updateOrCreate(
      { name: 'Honkai Star Rail' },
      {
        name: 'Honkai Star Rail',
        description:
          'Embarquez dans l\'Astral Express et voyagez à travers la galaxie dans ce RPG au tour par tour de nouvelle génération. Découvrez des mondes fantastiques et combattez aux côtés de compagnons uniques.',
        releaseDate: DateTime.fromISO('2023-04-26'),
        isPopular: true,
        officialSite: 'https://hsr.hoyoverse.com',
        wiki: 'https://honkai-star-rail.fandom.com',
      }
    )

    const fireEmblem = await Game.updateOrCreate(
      { name: 'Fire Emblem Heroes' },
      {
        name: 'Fire Emblem Heroes',
        description:
          'Rassemblez des héros légendaires de toute la franchise Fire Emblem dans ce tactical RPG mobile. Participez à des batailles stratégiques et construisez l\'équipe ultime.',
        releaseDate: DateTime.fromISO('2017-02-02'),
        isPopular: true,
        officialSite: 'https://fire-emblem-heroes.com',
        wiki: 'https://feheroes.fandom.com',
      }
    )

    const arknights = await Game.updateOrCreate(
      { name: 'Arknights' },
      {
        name: 'Arknights',
        description:
          'Dirigez Rhodes Island dans ce jeu de tower defense tactique. Recrutez des Opérateurs avec des capacités uniques et défendez-vous contre les menaces dans un monde dystopique.',
        releaseDate: DateTime.fromISO('2019-05-01'),
        isPopular: true,
        officialSite: 'https://www.arknights.global',
        wiki: 'https://arknights.fandom.com',
      }
    )

    const blueArchive = await Game.updateOrCreate(
      { name: 'Blue Archive' },
      {
        name: 'Blue Archive',
        description:
          'Devenez professeur à l\'Académie Kivotos et guidez vos étudiantes dans ce RPG tactique anime. Explorez une ville futuriste et résolvez des mystères tout en développant vos relations.',
        releaseDate: DateTime.fromISO('2021-02-04'),
        isPopular: false,
        officialSite: 'https://bluearchive.nexon.com',
        wiki: 'https://bluearchive.fandom.com',
      }
    )

    const epicSeven = await Game.updateOrCreate(
      { name: 'Epic Seven' },
      {
        name: 'Epic Seven',
        description:
          'Plongez dans une épopée épique avec des animations 2D époustouflantes. Collectionnez des héros, équipez-les stratégiquement et participez à des combats au tour par tour intenses.',
        releaseDate: DateTime.fromISO('2018-11-08'),
        isPopular: false,
        officialSite: 'https://epic7.smilegatemegaport.com',
        wiki: 'https://epic7x.com',
      }
    )

    // Attach genres
    const rpgGenre = await Genre.findByOrFail('name', 'RPG')
    const actionRpgGenre = await Genre.findByOrFail('name', 'Action RPG')
    const strategyGenre = await Genre.findByOrFail('name', 'Strategy')
    const tacticalRpgGenre = await Genre.findByOrFail('name', 'Tactical RPG')
    const gachaGenre = await Genre.findByOrFail('name', 'Gacha')
    const turnBasedGenre = await Genre.findByOrFail('name', 'Turn-Based')
    const towerDefenseGenre = await Genre.findByOrFail('name', 'Tower Defense')

    await genshin.related('genres').sync([actionRpgGenre.id, rpgGenre.id, gachaGenre.id])
    await honkai.related('genres').sync([turnBasedGenre.id, rpgGenre.id, gachaGenre.id])
    await fireEmblem
      .related('genres')
      .sync([tacticalRpgGenre.id, strategyGenre.id, gachaGenre.id])
    await arknights
      .related('genres')
      .sync([towerDefenseGenre.id, strategyGenre.id, gachaGenre.id])
    await blueArchive.related('genres').sync([tacticalRpgGenre.id, rpgGenre.id, gachaGenre.id])
    await epicSeven.related('genres').sync([turnBasedGenre.id, rpgGenre.id, gachaGenre.id])

    // Attach platforms
    const ios = await Platform.findByOrFail('name', 'iOS')
    const android = await Platform.findByOrFail('name', 'Android')
    const pc = await Platform.findByOrFail('name', 'PC')
    const ps5 = await Platform.findByOrFail('name', 'PlayStation 5')
    const ps4 = await Platform.findByOrFail('name', 'PlayStation 4')

    await genshin.related('platforms').sync([ios.id, android.id, pc.id, ps5.id, ps4.id])
    await honkai.related('platforms').sync([ios.id, android.id, pc.id])
    await fireEmblem.related('platforms').sync([ios.id, android.id])
    await arknights.related('platforms').sync([ios.id, android.id])
    await blueArchive.related('platforms').sync([ios.id, android.id])
    await epicSeven.related('platforms').sync([ios.id, android.id])

    // Attach some tags
    const metaTag = await Tag.findByOrFail('name', 'Meta')
    const f2pTag = await Tag.findByOrFail('name', 'F2P Friendly')
    const stratTag = await Tag.findByOrFail('name', 'Stratégie')

    await genshin.related('tags').sync([metaTag.id, f2pTag.id])
    await honkai.related('tags').sync([metaTag.id, f2pTag.id, stratTag.id])
    await fireEmblem.related('tags').sync([stratTag.id])
    await arknights.related('tags').sync([stratTag.id, f2pTag.id])
    */
  }
}
