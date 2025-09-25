import { ApplicationService } from '@adonisjs/core/types'
import vine from '@vinejs/vine'
import { CustomVineMessagesProvider } from '#start/custom_vine_messages'

export default class VineProvider {
  constructor(protected app: ApplicationService) {}

  async boot(): Promise<void> {
    vine.messagesProvider = new CustomVineMessagesProvider()
  }
}
