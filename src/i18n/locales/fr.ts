export const fr: Record<string, string> = {
  // Navigation
  'nav.home': 'Accueil',
  'nav.jobs': 'Contrats',
  'nav.createJob': 'Créer un Escrow',
  'nav.dashboard': 'Tableau de bord',
  'nav.arbitration': 'Panel d’Arbitrage',
  'nav.fiatRails': 'Passerelles Locales',
  'nav.connectWallet': 'Connecter le Wallet',
  'nav.disconnect': 'Déconnecter',
  'nav.connected': 'Connecté',

  // Hero
  'hero.badge': 'Propulsé par Stellar & Soroban SDK v22',
  'hero.title': 'Escrow Décentralisé pour Freelances sur Stellar',
  'hero.subtitle':
    'Sécurisez vos paiements par étapes dans des smart contracts Soroban sans intermédiaire. Livrables chiffrés, limite stricte de 2 révisions, panel d’arbitres impartiaux et retraits directs via Orange Money, Wave et comptes bancaires africains.',
  'hero.ctaClient': 'Créer un Contrat Escrow',
  'hero.ctaFreelancer': 'Explorer les Projets',
  'hero.statTvl': 'Valeur Totale Verrouillée',
  'hero.statSettled': 'Litiges Résolus',
  'hero.statCountries': 'Pays Pris en Charge',

  // Features
  'feat.title': 'Conçu pour le Freelancing International',
  'feat.desc': 'Éliminez les impayés, les révisions infinies et les retards de paiement grâce à la garantie cryptographique.',
  'feat.milestonesTitle': 'Escrow Multi-Jalons',
  'feat.milestonesDesc': 'Le client finance tous les jalons à l’avance dans le smart contract. Les fonds sont libérés instantanément à la validation de chaque livrable.',
  'feat.revisionsTitle': 'Protection Limite de 2 Révisions',
  'feat.revisionsDesc': 'Les freelances sont protégés contre les demandes abusives. Le client peut demander jusqu’à 2 révisions avant de devoir valider ou ouvrir un litige.',
  'feat.autoReleaseTitle': 'Libération Automatique en Cas de Silence',
  'feat.autoReleaseDesc': 'Si le client ne répond pas avant la fin du délai d’examen (ex. 3 jours), n’importe qui peut déclencher le paiement automatique du freelance.',
  'feat.arbitrationTitle': 'Arbitres en Nombre Impair',
  'feat.arbitrationDesc': 'Les litiges sont résolus par un panel vérifié (1, 3, 5 ou 7 membres) votant une répartition en points de base avec staking et slashing.',
  'feat.fiatTitle': 'Passerelles Locales Instantanées',
  'feat.fiatDesc': 'Intégration directe avec Cowrie, ClickPesa, Yellow Card et MoneyGram pour un retrait direct en monnaie locale.',

  // Wizard
  'wizard.title': 'Créer un Nouveau Contrat d’Escrow',
  'wizard.step1': '1. Portée du Projet',
  'wizard.step2': '2. Jalons & Budget',
  'wizard.step3': '3. Panel d’Arbitrage',
  'wizard.step4': '4. Financer l’Escrow',
  'wizard.client': 'Adresse Stellar du Client',
  'wizard.freelancer': 'Adresse Stellar du Freelance',
  'wizard.token': 'Jeton d’Escrow (XLM / USDC)',
  'wizard.milestoneTitle': 'Titre du Jalon',
  'wizard.milestoneAmount': 'Montant (XLM)',
  'wizard.milestoneDeadline': 'Date Limite Prévue',
  'wizard.addMilestone': '+ Ajouter un Autre Jalon',
  'wizard.oddPanelNotice': 'Le panel d’arbitres doit comporter un nombre impair de membres (1, 3, 5 ou 7) pour éviter toute égalité de vote.',
  'wizard.fundButton': 'Signer & Déposer l’Escrow sur Soroban',

  // Dashboard
  'dash.title': 'Tableau de Bord Escrow',
  'dash.clientTab': 'Mes Projets (Client)',
  'dash.freelancerTab': 'Mes Projets (Freelance)',
  'dash.empty': 'Aucun contrat actif trouvé pour ce wallet.',
  'dash.revisionsRemaining': 'révisions restantes',
  'dash.reviewWindow': 'Délai d’Examen',
  'dash.autoReleaseIn': 'Libération automatique dans',
  'dash.submitDeliverable': 'Soumettre le Livrable',
  'dash.approvePayout': 'Approuver & Libérer le Paiement',
  'dash.requestRevision': 'Demander une Révision',
  'dash.openDispute': 'Ouvrir un Litige',

  // Arbitration
  'arb.title': 'Centre d’Arbitrage des Litiges',
  'arb.subtitle': 'Examinez les livrables et preuves soumis, puis votez la répartition proportionnelle des fonds.',
  'arb.freelancerShare': 'Part du Freelance (Points de base)',
  'arb.clientRefund': 'Part Remboursée au Client',
  'arb.castVote': 'Enregistrer le Vote sur la Blockchain',
  'arb.threshold': 'Seuil de Majorité de Consensus',

  // Rails
  'rails.title': 'Passerelles Locales Africaines & Mondiales (SEP-24)',
  'rails.subtitle': 'Convertissez instantanément vos gains crypto vers votre compte Mobile Money ou bancaire local.',
  'rails.deposit': 'Déposer des Devises Locales',
  'rails.withdraw': 'Retirer vers Mobile Money / Banque',
  'rails.partner': 'Partenaire Anchor',
  'rails.instantNotice': 'Règlement instantané via les rails interactifs Stellar SEP-24.',
};
