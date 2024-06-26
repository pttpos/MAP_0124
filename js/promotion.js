// Function to show promotion modal
function showPromotionModal(station) {
    var promotionModal = new bootstrap.Modal(document.getElementById('promotionModal'), {
        keyboard: false
    });

    var promotionImagesContainerAll = document.getElementById('promotionContainerAll');
    var promotionImagesContainerPromotions = document.getElementById('promotionContainerPromotions');
    var promotionImagesContainerOpenings = document.getElementById('promotionContainerOpenings');

    // Clear previous promotions
    promotionImagesContainerAll.innerHTML = '';
    promotionImagesContainerPromotions.innerHTML = '';
    promotionImagesContainerOpenings.innerHTML = '';

    if (station.promotion && station.promotion.length > 0 && station.promotion[0] !== "") {
        station.promotion.forEach(promotion => {
            const promotionImageUrl = getPromotionImageUrl(promotion.promotion_id); // Get the promotion image URL

            // Create and append elements for All tab
            createAndAppendPromotionElements(promotion, promotionImageUrl, promotionImagesContainerAll);

            // Create and append elements for specific tabs
            if (promotion.promotion_id.toLowerCase().startsWith('promotion') && !promotion.promotion_id.toLowerCase().includes('opening')) {
                createAndAppendPromotionElements(promotion, promotionImageUrl, promotionImagesContainerPromotions);
            } else if (promotion.promotion_id.toLowerCase().includes('opening')) {
                createAndAppendPromotionElements(promotion, promotionImageUrl, promotionImagesContainerOpenings);
            }
        });
        promotionModal.show();
    } else {
        alert('No promotion available for this station.');
    }
}

// Helper function to create and append promotion elements
function createAndAppendPromotionElements(promotion, promotionImageUrl, container) {
    const promotionItem = document.createElement('div');
    promotionItem.classList.add('promotion-item', 'mb-3');

    const promotionImage = document.createElement('img');
    promotionImage.src = promotionImageUrl; // Update with the correct image URL
    promotionImage.classList.add('img-fluid', 'mb-2'); // Add classes for styling
    promotionItem.appendChild(promotionImage); // Append to promotion item

    const promotionText = document.createElement('p');
    promotionText.innerText = `${promotion.promotion_id} (ends on ${formatPromotionEndTime(promotion.end_time)})`; // Update with the promotion details
    promotionItem.appendChild(promotionText); // Append to promotion item

    container.appendChild(promotionItem); // Append promotion item to container
}

// Function to format promotion end time
function formatPromotionEndTime(endTime) {
    const date = new Date(endTime);
    if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${endTime}`);
        return "Invalid Date";
    }
    return date.toLocaleDateString();
}
// Function to get the promotion image URL based on the item name
function getPromotionImageUrl(item) {
    const itemImages = {
        "promotion 1": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening1.jpg",
        "promotion 2": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening1.jpg",
        "promotion 3": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening3.jpg",
        "promotion 4": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening4.jpg",
        "promotion opening 1": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening1.jpg",
        "promotion opening 2": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening2.jpg",
        "promotion opening 3": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening3.jpg",
        "promotion opening 5": "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/opening5.jpg",
        // Add other items as needed
    };
    return itemImages[item] || "https://raw.githubusercontent.com/pttpos/map_ptt/main/pictures/default.png"; // Default image if item not found
}

// Function to populate promotions dynamically
function populatePromotions(stations) {
    const promotionButton = document.getElementById('promotionBtn');
    const promotionNotificationDot = document.getElementById('promotionNotificationDot');
    const stationWithPromotion = stations.find(station => station.promotion && station.promotion.length > 0 && station.promotion[0] !== "");

    if (stationWithPromotion) {
        promotionNotificationDot.style.display = 'block'; // Show the red dot if there are promotions
        promotionNotificationDot.classList.add('pulse-animation'); // Add animation class
    } else {
        promotionNotificationDot.style.display = 'none'; // Hide the red dot if there are no promotions
        promotionNotificationDot.classList.remove('pulse-animation'); // Remove animation class
    }

    promotionButton.addEventListener('click', function () {
        if (stationWithPromotion) {
            showPromotionModal(stationWithPromotion);
        } else {
            alert('No promotion available.');
        }
    });
}

// Fetch station and promotion data and initialize promotions
fetch("https://raw.githubusercontent.com/pttpos/map_ptt/main/data/markers.json")
    .then(response => response.json())
    .then(data => {
        const stations = data.STATION;
        fetch("https://raw.githubusercontent.com/pttpos/map_ptt/main/data/promotions.json")
            .then(response => response.json())
            .then(promotionData => {
                const promotions = promotionData.PROMOTIONS;
                // Match promotions with stations
                stations.forEach(station => {
                    const stationPromotions = promotions.find(promo => promo.station_id === parseInt(station.id));
                    if (stationPromotions) {
                        station.promotion = stationPromotions.promotions;
                    }
                });
                populatePromotions(stations);
            })
            .catch(error => console.error('Error loading promotion data:', error));
    })
    .catch(error => console.error('Error loading station data:', error));

// Clear modal content on hide
document.getElementById('promotionModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('promotionContainerAll').innerHTML = '';
    document.getElementById('promotionContainerPromotions').innerHTML = '';
    document.getElementById('promotionContainerOpenings').innerHTML = '';
    // Ensure the modal backdrop is properly removed
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
});

// Manually hide the modal on close button click to ensure it closes properly
document.querySelector('#promotionModal .btn-close').addEventListener('click', function () {
    var promotionModal = bootstrap.Modal.getInstance(document.getElementById('promotionModal'));
    promotionModal.hide();
    // Ensure the modal backdrop is properly removed
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
});
