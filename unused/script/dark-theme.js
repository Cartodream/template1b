/**
 * Script pour gérer le thème sombre
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour appliquer le thème sombre aux tuiles de la carte
    function applyDarkThemeToMap() {
        if (map) {
            // Ajuster la luminosité des tuiles de la carte
            document.querySelectorAll('.leaflet-tile-pane').forEach(function(pane) {
                pane.style.filter = 'brightness(0.8) contrast(1.2) saturate(0.8)';
            });
            
            // Forcer la mise à jour de la carte
            map.invalidateSize();
        }
    }
    
    // Appliquer le thème sombre aux tuiles de la carte après le chargement
    if (typeof map !== 'undefined') {
        map.on('load', function() {
            applyDarkThemeToMap();
        });
        
        // Appliquer également lors du chargement des tuiles
        map.on('tileload', function() {
            applyDarkThemeToMap();
        });
    } else {
        // Si la carte n'est pas encore définie, attendre un peu
        setTimeout(applyDarkThemeToMap, 1000);
    }
});