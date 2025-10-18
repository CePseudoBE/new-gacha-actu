import { inject } from '@adonisjs/core'
import UserRepository from '#repositories/user_repository'
import RoleRepository from '#repositories/role_repository'
import { ConflictException, NotFoundException } from '#exceptions/http_exceptions'
import UserDto from '#dtos/user'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export interface RegisterData {
  fullName: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

@inject()
export default class AuthService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository
  ) {}

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<UserDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà')
    }

    // Get default role (user)
    const userRole = await this.roleRepository.findBySlug('user')
    if (!userRole) {
      throw new NotFoundException('Rôle utilisateur non trouvé')
    }

    // Create user
    const user = await this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      roleId: userRole.id,
    })

    return new UserDto(user)
  }

  /**
   * Login user
   */
  async login(ctx: HttpContext, data: LoginData): Promise<UserDto> {
    // Verify credentials
    const user = await User.verifyCredentials(data.email, data.password)

    // Load role relationship
    await user.load('role')

    // Login user via session
    await ctx.auth.use('web').login(user)

    return new UserDto(user)
  }

  /**
   * Logout user
   */
  async logout(ctx: HttpContext): Promise<void> {
    await ctx.auth.use('web').logout()
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(ctx: HttpContext): Promise<UserDto> {
    const user = ctx.auth.use('web').user
    if (!user) {
      throw new NotFoundException('Utilisateur non authentifié')
    }

    await user.load('role')
    return new UserDto(user)
  }

  /**
   * Change user password
   */
  async changePassword(ctx: HttpContext, data: ChangePasswordData): Promise<void> {
    const user = ctx.auth.use('web').user
    if (!user) {
      throw new NotFoundException('Utilisateur non authentifié')
    }

    // Verify current password
    await User.verifyCredentials(user.email, data.currentPassword)

    // Update password
    user.password = data.newPassword
    await user.save()
  }

  /**
   * Get user by ID (for admin purposes)
   */
  async getUserById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé')
    }

    return new UserDto(user)
  }

  /**
   * Check if user has specific role
   */
  async hasRole(ctx: HttpContext, roleSlug: string): Promise<boolean> {
    const user = ctx.auth.use('web').user
    if (!user) return false

    await user.load('role')
    return user.hasRole(roleSlug)
  }

  /**
   * Check if user has any of the specified roles
   */
  async hasAnyRole(ctx: HttpContext, roleSlugs: string[]): Promise<boolean> {
    const user = ctx.auth.use('web').user
    if (!user) return false

    await user.load('role')
    return user.hasAnyRole(roleSlugs)
  }
}
