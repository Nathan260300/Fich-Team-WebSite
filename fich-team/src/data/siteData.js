export const HOME_CARDS = [
  {
    id: 'fich',
    emoji: '🏆',
    title: "C'est quoi FICH ?",
    shortText: 'FICH = Force · Intelligence · Charisme · Honneur. Une communauté gaming unie par des valeurs fortes.',
    tags: ['Communauté', 'Gaming', 'Discord'],
    modalContent: [
      '<strong>F</strong> — Force : La force de caractère, la persévérance face aux défis du jeu et de la vie.',
      '<strong>I</strong> — Intelligence : Jouer avec stratégie, apprendre de chaque partie, évoluer constamment.',
      '<strong>C</strong> — Charisme : Être un joueur positif, inspirer les autres, rayonner dans la communauté.',
      '<strong>H</strong> — Honneur : Respecter les adversaires, jouer fair-play, porter haut les valeurs de la team.',
    ],
  },
  {
    id: 'valeurs',
    emoji: '⚡',
    title: 'Nos valeurs',
    shortText: "Respect, entraide, fun et fair-play. Ici, chaque membre compte et la toxicité n'a pas sa place.",
    tags: ['Valeurs', 'Respect', 'Entraide'],
    modalContent: [
      'La <strong>FICH Team</strong> s\'est construite sur des valeurs simples mais essentielles.',
      'Nous croyons que le gaming est avant tout une expérience humaine : on gagne ensemble, on perd ensemble.',
      'La <strong>toxicité</strong> est bannie. Le <strong>fair-play</strong> est obligatoire. L\'<strong>entraide</strong> est encouragée.',
      "Chaque membre de la team est une pièce essentielle du puzzle — sans toi, la team n'est pas complète.",
    ],
  },
  {
    id: 'discord',
    emoji: '🎮',
    title: 'Notre serveur Discord',
    shortText: 'Des salons dédiés à chaque jeu, des events réguliers, et une communauté soudée 24/7.',
    tags: ['Discord', 'Events', '24/7'],
    modalContent: [
      'Notre serveur Discord est le cœur battant de la <strong>FICH Team</strong>.',
      "Tu y trouveras des salons dédiés à tous tes jeux favoris, des channels de discussion, et une équipe de modération bienveillante.",
      'Des <strong>events réguliers</strong> sont organisés : tournois, sessions de jeu en équipe, soirées thématiques.',
      'Rejoins-nous et trouve ta place parmi des centaines de joueurs passionnés.',
    ],
  },
];

export const JOIN_SECTIONS = [
  {
    num: '01',
    tag: 'Prérequis',
    title: 'Rejoindre le serveur Discord',
    desc: "La première étape pour rejoindre la FICH Team est d'intégrer notre serveur Discord. C'est là que tout se passe : annonces, events, discussions, recrutements.",
    requirements: [
      'Avoir un compte Discord actif',
      'Respecter le règlement du serveur',
      'Se présenter dans le salon dédié',
    ],
    info: 'Notre serveur accueille <strong>joueurs de tous niveaux</strong>. Débutant ou expert, tu as ta place ici.',
    cta: { label: 'Rejoindre le Discord', href: 'https://discord.gg/fichteam', primary: true },
  },
  {
    num: '02',
    tag: 'Candidature',
    title: 'Postuler comme membre FICH',
    desc: 'Une fois sur le serveur, tu peux postuler pour devenir membre officiel de la FICH Team. Le processus est simple et transparent.',
    requirements: [
      'Être présent sur le serveur depuis au moins 2 semaines',
      "Avoir participé à au moins un event",
      'Partager les valeurs FICH (respect, fair-play, entraide)',
      'Remplir le formulaire de candidature',
    ],
    info: "Les candidatures sont évaluées par <strong>l'équipe de modération</strong> dans un délai de 7 jours.",
    cta: { label: 'Voir le formulaire', href: '#', primary: false },
  },
];
