import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await this.seed(await import('#database/seeders/0_role_seeder'))
    await this.seed(await import('#database/seeders/2_genre_seeder'))
    await this.seed(await import('#database/seeders/3_platform_seeder'))
    await this.seed(await import('#database/seeders/4_tag_seeder'))
    await this.seed(await import('#database/seeders/5_article_category_seeder'))
    await this.seed(await import('#database/seeders/8_guide_type_seeder'))
    await this.seed(await import('#database/seeders/9_difficulty_level_seeder'))
    await this.seed(await import('#database/seeders/11_user_auth_seeder'))
  }

  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }
}
