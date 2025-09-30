export const heroConfig = {
  title: "Anime Gacha Pulse",
  subtitle:
    "Par un fan, pour les fans. Plongez dans l'univers des jeux Gacha avec des guides experts, des tier lists à jour et toute l'actualité de vos jeux préférés.",
  buttons: [
    {
      id: "actus",
      label: "Actus",
      href: "/news",
      variant: "outline" as const,
    },
    {
      id: "a-venir",
      label: "À venir",
      href: "/upcoming",
      variant: "outline" as const,
    },
  ],
  partners: [
    {
      id: "ldplayer",
      name: "LDPlayer",
      href: "https://leap.ldplayer.gg/T4DYBI9Ic",
      logo: {
        desktop:
          "https://res.ldrescdn.com/ldplayer-official/static/image/home/btn/down-fr.svg?url",
        mobile: "/icons/ldplayer.svg",
      },
      alt: "LDPlayer - Émulateur Android pour PC",
      dimensions: {
        desktop: { width: 200, height: 60 },
        mobile: { width: 48, height: 48 },
      },
    },
    {
      id: "gamesplanet",
      name: "Gamesplanet",
      href: "https://fr.gamesplanet.com/?ref=kakutvd",
      logo: {
        desktop: "/icons/gamsplanetbig.svg",
        mobile: "/icons/gamesplanetsmall.png",
      },
      alt: "Gamesplanet - Boutique de jeux PC",
      dimensions: {
        desktop: { width: 200, height: 32 },
        mobile: { width: 48, height: 48 },
      },
    },
  ],
  images: {
    mobile: [
      {
        id: "7ds-mobile",
        src: "/img/7ds-original.jpg",
        alt: "Seven Deadly Sins Origins",
      },
      {
        id: "bsr-desktop-2",
        src: "/img/bsr.jpg",
        alt: "Bleach Soul Resonance",
      },
    ],
    desktop: [
      {
        id: "7ds-mobile",
        src: "/img/7ds-original.jpg",
        alt: "Seven Deadly Sins Origins",
      },
      {
        id: "bsr-desktop-2",
        src: "/img/bsr.jpg",
        alt: "Bleach Soul Resonance",
      },
    ],
  },
};
