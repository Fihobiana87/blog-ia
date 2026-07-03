/**
 * SIGNAL — Base d'articles
 * ------------------------------------------------------------------
 * Ce fichier simule la base de contenu que l'automatisation alimentera.
 * Chaque objet représente un article "publié" par le pipeline :
 * détection de signal → génération → vérification → mise en ligne.
 *
 * Pour tester la publication automatique : ajoutez un objet en tête
 * du tableau ARTICLES (unshift) avec un "publishedAt" récent — la home
 * et la page article se mettent à jour sans aucune autre modification.
 * ------------------------------------------------------------------
 */

const ARTICLES = [
  {
    id: "a-2026-047-01",
    slug: "agents-ia-autonomes-levee-2-3md",
    title: "Les agents IA autonomes lèvent 2,3 Md$ sur le premier semestre 2026",
    category: "Startups",
    excerpt: "Les fonds qui pariaient sur les copilotes se replient sur une thèse plus radicale : des agents capables d'exécuter une tâche du début à la fin, sans supervision humaine.",
    signalScore: 96,
    readTime: 6,
    publishedAt: "2026-07-03T08:12:00",
    author: "Automatisation SIGNAL",
    autoPublished: true,
    tags: ["financement", "agents ia", "venture"],
    featured: true,
    content: [
      "Sur les six premiers mois de 2026, les startups qui construisent des agents autonomes — capables de planifier, exécuter et corriger une tâche sans intervention humaine à chaque étape — ont capté 2,3 milliards de dollars de financement, contre 640 millions sur la même période en 2025.",
      "La bascule est nette : les fonds qui misaient sur des copilotes, ces outils qui suggèrent une action que l'humain valide, réallouent leurs tickets vers des équipes qui promettent une exécution de bout en bout. Le raisonnement tient en une phrase, répétée dans une dizaine de mémos d'investissement consultés : la valeur n'est plus dans la suggestion, elle est dans la tâche terminée.",
      "Cette accélération pose une question opérationnelle simple mais non résolue : qui est responsable quand un agent autonome se trompe ? Les contrats de licence évoluent vite pour intégrer des clauses de supervision minimale, mais la jurisprudence reste quasi inexistante.",
      "Pour les équipes produit, le signal à suivre n'est pas le montant levé mais le taux de tâches menées à terme sans correction humaine — une métrique que peu de startups publient encore, et que les prochains tours de table risquent d'exiger."
    ]
  },
  {
    id: "a-2026-047-02",
    slug: "startups-francaises-small-language-models",
    title: "Pourquoi les startups françaises misent sur les small language models",
    category: "Intelligence Artificielle",
    excerpt: "Face au coût d'inférence des grands modèles généralistes, une génération de startups françaises construit des modèles spécialisés, plus petits, moins chers et plus faciles à auditer.",
    signalScore: 88,
    readTime: 5,
    publishedAt: "2026-07-02T17:40:00",
    author: "Automatisation SIGNAL",
    autoPublished: true,
    tags: ["slm", "france", "infrastructure"],
    featured: false,
    content: [
      "Le calcul économique a changé. Pour une tâche métier étroite — classer des tickets support, extraire des clauses contractuelles, résumer des comptes rendus internes — un modèle généraliste de plusieurs centaines de milliards de paramètres est souvent une réponse disproportionnée, coûteuse à l'inférence et difficile à auditer.",
      "Plusieurs équipes françaises entraînent désormais des modèles de quelques milliards de paramètres, spécialisés sur un domaine, hébergés sur une infrastructure européenne. L'argument commercial n'est plus seulement le prix : c'est la traçabilité, exigée par des clients dans la banque, l'assurance et le secteur public.",
      "Reste un obstacle : la qualité des données d'entraînement spécialisées, souvent rares et coûteuses à constituer proprement. Les équipes qui réussissent sont, pour l'instant, celles qui ont noué des partenariats de données avant de lever des fonds — pas l'inverse."
    ]
  },
  {
    id: "a-2026-047-03",
    slug: "retour-interfaces-vocales-guerre-assistants",
    title: "Le retour des interfaces vocales : la nouvelle guerre des assistants",
    category: "Deep Tech",
    excerpt: "La latence est enfin descendue sous le seuil de la conversation naturelle. Résultat : une bataille d'infrastructure discrète mais très coûteuse s'engage autour de la voix.",
    signalScore: 79,
    readTime: 4,
    publishedAt: "2026-07-02T09:05:00",
    author: "Automatisation SIGNAL",
    autoPublished: true,
    tags: ["voix", "latence", "produit"],
    featured: false,
    content: [
      "Pendant des années, l'interface vocale a été une promesse déçue : un temps de réponse trop long cassait l'illusion de conversation. Les dernières générations de modèles de synthèse et de reconnaissance descendent désormais sous les 300 millisecondes de bout en bout, un seuil considéré comme celui du naturel perçu.",
      "Ce basculement technique rouvre un marché que beaucoup pensaient clos. Plusieurs équipes reconstruisent des piles vocales complètes plutôt que d'assembler des briques tierces, pariant que la latence deviendra un avantage concurrentiel aussi déterminant que la qualité de la voix elle-même.",
      "Le coût d'infrastructure de ces piles reste élevé, ce qui explique pourquoi les cas d'usage rentables se concentrent pour l'instant sur des verticaux à forte valeur par appel : support client premium, vente assistée, santé."
    ]
  },
  {
    id: "a-2026-047-04",
    slug: "growth-loops-apps-ia-0-a-1m",
    title: "Growth loops : comment des apps IA passent de 0 à 1 million d'utilisateurs en 90 jours",
    category: "Growth & Data",
    excerpt: "Trois mécaniques reviennent systématiquement dans les croissances les plus rapides observées ce trimestre : la boucle de partage du résultat, la friction d'essai nulle et la preuve sociale instantanée.",
    signalScore: 91,
    readTime: 7,
    publishedAt: "2026-07-01T14:20:00",
    author: "Automatisation SIGNAL",
    autoPublished: true,
    tags: ["croissance", "acquisition", "produit"],
    featured: false,
    content: [
      "En examinant une douzaine de courbes de croissance publiques sur les applications grand public dopées à l'IA générative, un motif se dégage : la croissance la plus rapide ne vient presque jamais de la publicité payante, mais du résultat produit lui-même qui devient l'objet du partage.",
      "La mécanique se décompose en trois temps. D'abord, une boucle où le résultat généré — une image, un texte, une vidéo — porte la marque visible de l'outil sans imposer de friction au partage. Ensuite, un essai sans compte ni carte bancaire, qui repousse la conversion après la démonstration de valeur plutôt qu'avant. Enfin, une preuve sociale affichée en temps réel, qui rassure sur la légitimité de l'outil au moment précis du doute.",
      "Ce qui distingue les équipes qui tiennent la distance de celles qui retombent après le pic initial : les premières instrumentent leur boucle dès le premier jour et savent précisément quel pourcentage de nouveaux utilisateurs vient de chaque mécanique."
    ]
  },
  {
    id: "a-2026-047-05",
    slug: "edge-ai-puces-remplacer-cloud",
    title: "Edge AI : les puces qui veulent remplacer le cloud",
    category: "Deep Tech",
    excerpt: "Une nouvelle génération de puces d'inférence embarquée promet d'exécuter des modèles de taille moyenne directement sur l'appareil, sans appel réseau.",
    signalScore: 74,
    readTime: 5,
    publishedAt: "2026-06-30T11:00:00",
    author: "Automatisation SIGNAL",
    autoPublished: true,
    tags: ["edge", "matériel", "inférence"],
    featured: false,
    content: [
      "L'argument du edge AI n'est plus seulement la confidentialité, c'est la résilience économique : chaque appel évité vers un modèle hébergé dans le cloud est un coût d'inférence en moins pour l'éditeur du logiciel.",
      "Les nouvelles puces annoncées ce trimestre visent des modèles de quelques milliards de paramètres, suffisants pour la plupart des tâches de résumé, de classification ou d'assistance rédactionnelle courante, exécutés entièrement hors ligne.",
      "Le compromis reste réel : ces puces ne remplacent pas les modèles les plus capables, réservés aux tâches complexes. La tendance qui se dessine est hybride — un petit modèle local pour l'essentiel, un appel réseau réservé aux cas difficiles."
    ]
  },
  {
    id: "a-2026-047-06",
    slug: "fin-cold-outreach-agents-ia-closent-deals",
    title: "La fin du cold outreach ? Les agents IA qui négocient et closent des deals",
    category: "Startups",
    excerpt: "Des équipes commerciales délèguent désormais la qualification, la relance et une partie de la négociation à des agents conversationnels autonomes.",
    signalScore: 83,
    readTime: 5,
    publishedAt: "2026-06-29T16:30:00",
    author: "Automatisation SIGNAL",
    autoPublished: true,
    tags: ["vente", "agents ia", "b2b"],
    featured: false,
    content: [
      "La prospection commerciale a longtemps résisté à l'automatisation au-delà du simple envoi de messages. Ce qui change en 2026, c'est la capacité d'un agent à mener une conversation multi-tours, à qualifier un besoin réel et à proposer une offre adaptée sans script figé.",
      "Plusieurs équipes commerciales rapportent déléguer désormais l'intégralité de la qualification initiale à un agent, l'humain n'intervenant qu'à partir du moment où une intention d'achat concrète est confirmée.",
      "La question qui reste ouverte est celle de la confiance côté acheteur : plusieurs retours mentionnent une baisse du taux de réponse lorsque l'interlocuteur identifie qu'il échange avec un agent, ce qui pousse certaines équipes vers une transparence assumée plutôt que dissimulée."
    ]
  }
];

// Tri par date de publication décroissante — l'automatisation peut pousser
// ses articles dans n'importe quel ordre, la home se charge du tri.
ARTICLES.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
