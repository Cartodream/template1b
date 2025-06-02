// Fonction optimisée pour créer les marqueurs
function createOptimizedMarkers() {
    // Créer un cache pour les icônes
    const iconCache = {};
    
    // Fonction pour obtenir une icône du cache ou en créer une nouvelle
    function getIcon(category) {
        const iconName = normalizeString(category);
        if (!iconCache[iconName]) {
            iconCache[iconName] = L.icon({
                iconUrl: `image/${iconName}.png`,
                iconSize: [25, 25],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });
        }
        return iconCache[iconName];
    }
    
    // Créer les marqueurs par lots
    const markersToAdd = [];
    
    // Parcourir tous les POIs
    poi.features.forEach(feature => {
        // Création de l'icône personnalisée depuis le cache
        const icon = getIcon(feature.properties.sous_cat);
        
        // Création du marqueur
        const marker = L.marker(
            [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
            { icon: icon }
        );
        
        // Stockage des données pour la popup sans la créer immédiatement
        marker.poiData = feature.properties;
        
        // Ajouter un gestionnaire d'événements pour créer la popup à la demande
        marker.on('click', function() {
            if (!this.getPopup()) {
                const popupContent = createPopupContent(this.poiData);
                this.bindPopup(popupContent, {
                    maxWidth: window.innerWidth > 768 ? 300 : 250,
                    minWidth: window.innerWidth > 768 ? 200 : 150,
                    closeOnClick: true,
                    autoClose: true,
                    autoPanPadding: [10, 10]
                });
            }
        });
        
        // Gestion spéciale pour les bassins
        if (feature.properties.nom === "Orchidées sauvages - Bassin de la Vaucouleurs") {
            setupBassinHandler(marker, bassinVaucouleursLayer);
        } else if (feature.properties.nom === "Orchidées sauvages - Bassin de la Vesgre") {
            setupBassinHandler(marker, bassinVesgreLayer);
        }
        
        // Stockage du marqueur avec ses catégories pour le filtrage
        const category = mapToFilterCategory(feature.properties.categorie);
        const subcategory = mapToFilterSubcategory(feature.properties.sous_cat);
        
        if (!allMarkers[category]) {
            allMarkers[category] = {};
        }
        
        if (!allMarkers[category][subcategory]) {
            allMarkers[category][subcategory] = [];
        }
        
        allMarkers[category][subcategory].push(marker);
        
        // Ajouter à la liste des marqueurs à ajouter
        markersToAdd.push(marker);
    });
    
    // Ajouter tous les marqueurs au cluster en une seule opération
    markers.addLayers(markersToAdd);
    
    // Ajouter le cluster à la carte
    map.addLayer(markers);
}

// Fonction pour créer le contenu de la popup à la demande
function createPopupContent(properties) {
    let popupContent = `<h3>${properties.nom}</h3>`;
    
    // Conteneur pour la mise en page à deux colonnes
    popupContent += `<div class="popup-container">`;
    
    // Colonne de gauche pour le descriptif
    popupContent += `<div class="popup-text">`;
    if (properties.descriptif) {
        popupContent += `<p>${properties.descriptif}</p>`;
    }
    popupContent += `</div>`;
    
    // Colonne de droite pour l'image
    if (properties.photo) {
        popupContent += `
            <div class="popup-image">
                <img src="${properties.photo}" alt="${properties.nom}" class="popup-thumbnail" 
                     data-full-img="${properties.photo}" 
                     data-photo2="${properties.photo2 || ''}"
                     data-photo3="${properties.photo3 || ''}"
                     data-photo4="${properties.photo4 || ''}"
                     data-photo5="${properties.photo5 || ''}"
                     data-photo6="${properties.photo6 || ''}"
                     data-photo7="${properties.photo7 || ''}"
                     data-photo8="${properties.photo8 || ''}"
                     data-photo9="${properties.photo9 || ''}"
                     data-photo10="${properties.photo10 || ''}"
                     data-photo11="${properties.photo11 || ''}"
                     data-photo12="${properties.photo12 || ''}"
                     data-photo13="${properties.photo13 || ''}">
            </div>
        `;
    } else {
        // Si pas d'image, ajuster l'espace pour le texte
        popupContent = popupContent.replace('<div class="popup-text">', '<div class="popup-text" style="width:100%">');
    }
    
    popupContent += `</div>`; // Fin du conteneur à deux colonnes
    
    // Section pour les liens et informations supplémentaires
    popupContent += `<div class="popup-links">`;
    
    if (properties.tel) {
        popupContent += `<p><strong>Tél :</strong> ${properties.tel}</p>`;
    }
    
    if (properties.mail) {
        popupContent += `<p><strong>Email :</strong> ${properties.mail}</p>`;
    }
    
    if (properties.site_web) {
        popupContent += `<p><a href="${properties.site_web}" target="_blank">Plus d'informations</a></p>`;
    }
    
    if (properties.accessibilité) {
        popupContent += `<p><strong>Accessible :</strong> ${properties.accessibilité}</p>`;
    }
    
    if (properties.Latitude && properties.Longitude) {
        popupContent += `<p><a href="https://www.google.com/maps/dir//${properties.Latitude},${properties.Longitude}" target="_blank">Itinéraire</a></p>`;
    }
    
    popupContent += `</div>`; // Fin de la section des liens
    
    return popupContent;
}

// Fonction pour configurer les gestionnaires d'événements pour les bassins
function setupBassinHandler(marker, bassinLayer) {
    marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        if (bassinLayer) {
            // Retirer temporairement le marqueur du cluster
            markers.removeLayer(marker);
            // Ajouter le marqueur directement à la carte
            marker.addTo(map);
            // Ajouter la couche du bassin
            map.addLayer(bassinLayer);
            // Ouvrir d'abord le popup
            marker.openPopup();
            // Puis ajuster la vue avec un délai pour éviter les conflits
            setTimeout(function() {
                // Utiliser {animate: false} pour éviter les problèmes avec le popup
                map.fitBounds(bassinLayer.getBounds(), {animate: false});
                // S'assurer que le popup reste ouvert après le zoom
                if (!marker.isPopupOpen()) {
                    marker.openPopup();
                }
            }, 100);
        }
    });
    
    marker.on('popupclose', function() {
        if (bassinLayer && map.hasLayer(bassinLayer)) {
            map.removeLayer(bassinLayer);
        }
        // Remettre le marqueur dans le cluster
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
            markers.addLayer(marker);
        }
    });
}