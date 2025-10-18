import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in development mode and seeder
     * is not explicitly running in production
     */
    if (!app.inDev && !this.environment) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.seed(await import('#database/seeders/0_role_seeder'))
    await this.seed(await import('#database/seeders/2_genre_seeder'))
    await this.seed(await import('#database/seeders/3_platform_seeder'))
    await this.seed(await import('#database/seeders/4_tag_seeder'))
    await this.seed(await import('#database/seeders/5_article_category_seeder'))
    await this.seed(await import('#database/seeders/8_guide_type_seeder'))
    await this.seed(await import('#database/seeders/9_difficulty_level_seeder'))
    await this.seed(await import('#database/seeders/6_game_seeder'))
    await this.seed(await import('#database/seeders/7_article_seeder'))
    await this.seed(await import('#database/seeders/10_youtube_video_seeder'))
    await this.seed(await import('#database/seeders/11_user_auth_seeder'))
  }
}
