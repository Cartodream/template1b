// Fichier de traductions
const translations = {
  'fr': {
    'carte_interactive': 'Carte interactive',
    'explorer': 'Explorer',
    'patrimoine_architectural': 'Patrimoine Architectural',
    'patrimoine_bati': 'Patrimoine bâti monumental',
    'patrimoine_religieux': 'Patrimoine Religieux',
    'bati_traditionnel': 'Bâti Traditionnel',
    'patrimoine_naturel': 'Patrimoine Naturel',
    'etangs_rivieres': 'Etangs et Rivières',
    'effraie': 'Effraie',
    'cheveche': 'Chevêche',
    'flore': 'Flore',
    'rapace': 'Rapace',
    'heron': 'Héron',
    'forets_parcs': 'Forêts et Parcs',
    'chauve_souris': 'Chauve Souris',
    'cervides': 'Cervidés',
    'hirondelle': 'Hirondelle',
    'autres_points': 'Autres Points',
    'curiosite': 'Curiosité',
    'tout_selectionner': 'Tout sélectionner',
    'tout_deselectionner': 'Tout désélectionner',
    'carte': 'Carte',
    'signet': 'Signet'
  },
  'en': {
    'carte_interactive': 'Interactive Map',
    'explorer': 'Explore',
    'patrimoine_architectural': 'Architectural Heritage',
    'patrimoine_bati': 'Monumental Built Heritage',
    'patrimoine_religieux': 'Religious Heritage',
    'bati_traditionnel': 'Traditional Buildings',
    'patrimoine_naturel': 'Natural Heritage',
    'etangs_rivieres': 'Ponds and Rivers',
    'effraie': 'Barn Owl',
    'cheveche': 'Little Owl',
    'flore': 'Flora',
    'rapace': 'Raptor',
    'heron': 'Heron',
    'forets_parcs': 'Forests and Parks',
    'chauve_souris': 'Bats',
    'cervides': 'Deer',
    'hirondelle': 'Swallow',
    'autres_points': 'Other Points',
    'curiosite': 'Curiosity',
    'tout_selectionner': 'Select all',
    'tout_deselectionner': 'Deselect all',
    'carte': 'Map',
    'signet': 'Bookmark'
  }
};

// Fonction pour traduire l'interface
function translateUI(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // Sauvegarder la langue choisie
  localStorage.setItem('language', lang);
  
  // Mettre à jour l'attribut lang de la balise html
  document.documentElement.lang = lang;
  
  // Mettre à jour le bouton actif
  document.querySelectorAll('.language-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Charger la langue sauvegardée ou utiliser le français par défaut
document.addEventListener('DOMContentLoaded', function() {
  const savedLang = localStorage.getItem('language') || 'fr';
  translateUI(savedLang);
});