<template>
  <nav class="hidden md:flex md:flex-1 md:justify-center">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem v-for="item in config.items" :key="item.id">
          <!-- Menu avec sous-items -->
          <template v-if="item.children && item.children.length > 0">
            <NavigationMenuTrigger>{{ item.label }}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li v-for="child in item.children" :key="child.id">
                  <NavigationMenuLink as-child>
                    <NuxtLink
                      :to="child.href"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">{{ child.label }}</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {{ child.description }}
                      </p>
                    </NuxtLink>
                  </NavigationMenuLink>
                </li>
                <li v-if="item.featured" class="row-span-3">
                  <NavigationMenuLink as-child>
                    <NuxtLink
                      :to="item.featured.href"
                      class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    >
                      <div class="mb-2 mt-4 text-lg font-medium">
                        {{ item.featured.label }}
                      </div>
                      <p class="text-sm leading-tight text-muted-foreground">
                        {{ item.featured.description }}
                      </p>
                    </NuxtLink>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </template>

          <!-- Menu simple -->
          <template v-else>
            <NavigationMenuLink as-child>
              <NuxtLink
                :to="item.href"
                class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                {{ item.label }}
              </NuxtLink>
            </NavigationMenuLink>
          </template>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </nav>
</template>

<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

interface Props {
  config: {
    items: Array<{
      id: string
      label: string
      href: string
      children?: Array<{
        id: string
        label: string
        href: string
        description?: string
      }>
      featured?: {
        label: string
        href: string
        description: string
      }
    }>
  }
}

defineProps<Props>()
</script>
