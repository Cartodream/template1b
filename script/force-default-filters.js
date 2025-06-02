// Script pour forcer les filtres par défaut au chargement de la page
(function() {
    // Vérifier si c'est un rafraîchissement ou un chargement direct
    const isDirectLoad = !document.referrer || 
                         (document.referrer.indexOf('index.html') > -1 && window.location.href.indexOf('index.html') > -1) ||
                         (document.referrer.indexOf('liste.html') > -1 && window.location.href.indexOf('liste.html') > -1);
    
    // Si c'est un chargement direct ou un rafraîchissement, supprimer les filtres sauvegardés
    if (isDirectLoad) {
        sessionStorage.removeItem('sharedFilters');
    }
    
    // Fonction pour appliquer les filtres par défaut
    function applyDefaultFilters() {
        // Cocher uniquement les cases du patrimoine architectural
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            const category = checkbox.dataset.category;
            checkbox.checked = (category === 'patrimoine_architectural');
        });
        
        // Mettre à jour les filtres internes si on est sur index.html
        if (window.location.href.indexOf('index.html') > -1 && typeof updateMarkers === 'function') {
            // Attendre que la carte soit initialisée
            setTimeout(function() {
                updateMarkers();
            }, 500);
        }
        
        // Mettre à jour la liste si on est sur liste.html
        if (window.location.href.indexOf('liste.html') > -1 && typeof filterPois === 'function') {
            // Attendre que la liste soit initialisée
            setTimeout(function() {
                filterPois();
            }, 500);
        }
    }
    
    // Si c'est un chargement direct ou un rafraîchissement, appliquer les filtres par défaut
    if (isDirectLoad) {
        // Attendre que le DOM soit chargé
        document.addEventListener('DOMContentLoaded', function() {
            // Attendre que les autres scripts aient fini de s'exécuter
            setTimeout(applyDefaultFilters, 100);
        });
    }
})();