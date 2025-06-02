// Script pour gérer le panneau latéral et afficher les POIs
document.addEventListener('DOMContentLoaded', function() {
    // Références aux éléments
    const toggleListBtn = document.getElementById('toggle-list-btn');
    const sidePanel = document.getElementById('side-panel');
    const closeSidePanel = document.querySelector('.close-side-panel');
    const poiListContainer = document.getElementById('poi-list');
    
    // Fonction pour ouvrir/fermer le panneau
    toggleListBtn.addEventListener('click', function() {
        sidePanel.classList.toggle('active');
        updatePoiList();
    });
    
    // Fonction pour fermer le panneau
    closeSidePanel.addEventListener('click', function() {
        sidePanel.classList.remove('active');
    });
    
    // Fonction pour mettre à jour la liste des POIs en fonction des filtres
    function updatePoiList() {
        // Vider la liste
        poiListContainer.innerHTML = '';
        
        // Récupérer les filtres actifs
        const activeFilters = {};
        for (const category in categoryFilters) {
            for (const subcategory in categoryFilters[category]) {
                if (categoryFilters[category][subcategory]) {
                    if (!activeFilters[category]) {
                        activeFilters[category] = [];
                    }
                    activeFilters[category].push(subcategory);
                }
            }
        }
        
        // Filtrer les POIs
        const filteredPois = poi.features.filter(feature => {
            const category = mapToFilterCategory(feature.properties.categorie);
            const subcategory = mapToFilterSubcategory(feature.properties.sous_cat);
            
            return activeFilters[category] && activeFilters[category].includes(subcategory);
        });
        
        // Afficher les POIs filtrés
        if (filteredPois.length === 0) {
            poiListContainer.innerHTML = '<div class="no-results">Aucun point d\'intérêt ne correspond à votre recherche.</div>';
            return;
        }
        
        filteredPois.forEach(poi => {
            const properties = poi.properties;
            
            // Création de la carte
            const card = document.createElement('div');
            card.className = 'poi-card';
            
            // Image
            let imageHtml = '';
            if (properties.photo) {
                imageHtml = `<img src="${properties.photo}" alt="${properties.nom}" class="poi-image">`;
            } else {
                imageHtml = `<div class="poi-image-placeholder"></div>`;
            }
            
            // Contenu de la carte
            card.innerHTML = `
                ${imageHtml}
                <div class="poi-content">
                    <h3 class="poi-title">${properties.nom}</h3>
                    <span class="poi-category">${properties.sous_cat}</span>
                    <p class="poi-description">${properties.descriptif || 'Aucune description disponible.'}</p>
                    <div class="poi-location">
                        <i class="fas fa-map-marker-alt"></i> ${properties.commune || ''}
                        ${properties.adresse ? ` - ${properties.adresse}` : ''}
                    </div>
                    <a href="#" class="poi-button" data-id="${properties.id}">Voir sur la carte</a>
                </div>
            `;
            
            // Ajouter un gestionnaire d'événements pour le bouton "Voir sur la carte"
            const viewButton = card.querySelector('.poi-button');
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Centrer la carte sur ce POI
                map.setView([poi.geometry.coordinates[1], poi.geometry.coordinates[0]], 16);
                
                // Trouver le marqueur correspondant
                for (const category in allMarkers) {
                    for (const subcategory in allMarkers[category]) {
                        const marker = allMarkers[category][subcategory].find(m => 
                            m.getLatLng().lat === poi.geometry.coordinates[1] && 
                            m.getLatLng().lng === poi.geometry.coordinates[0]
                        );
                        if (marker) {
                            // Ouvrir le popup du marqueur
                            marker.openPopup();
                            return;
                        }
                    }
                }
            });
            
            poiListContainer.appendChild(card);
        });
    }
    
    // Mettre à jour la liste des POIs lorsque les filtres changent
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (sidePanel.classList.contains('active')) {
                updatePoiList();
            }
        });
    });
});