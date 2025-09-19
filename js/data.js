// Kalavrita Guide Data
const kalavritaData = {
    restaurants: [
        {
            id: 1,
            name: "OINOMAGEIREIO Spitiko",
            type: "Traditional",
            description: "Authentic Greek taverna serving homemade dishes with local ingredients. Famous for their lamb specialties and traditional recipes passed down through generations.",
            rating: 4.8,
            priceRange: "€€",
            features: ["Outdoor Seating", "Local Wine", "Family Friendly", "Vegetarian Options"],
            hours: "12:00 - 22:00",
            phone: "+30 26920 22222",
            address: "Main Street 15, Kalavrita",
            coordinates: { lat: 38.0322, lng: 22.1123 },
            image: "🍽️",
            highlights: ["Lamb Kleftiko", "Mountain Tea", "Local Cheese"]
        },
        {
            id: 2,
            name: "Taverna Vouraikos",
            type: "Traditional",
            description: "Located near the historic railway station, this taverna offers stunning mountain views and traditional Greek cuisine with a focus on local produce.",
            rating: 4.6,
            priceRange: "€€",
            features: ["Mountain View", "Railway History", "Local Products", "Traditional Music"],
            hours: "11:30 - 23:00",
            phone: "+30 26920 22333",
            address: "Railway Station Area, Kalavrita",
            coordinates: { lat: 38.0300, lng: 22.1100 },
            image: "🚂",
            highlights: ["Grilled Trout", "Wild Mushrooms", "Honey Desserts"]
        },
        {
            id: 3,
            name: "Cafe Kalavrita",
            type: "Cafe",
            description: "Cozy coffee shop perfect for morning coffee, light meals, and afternoon relaxation. Features local pastries and mountain views.",
            rating: 4.4,
            priceRange: "€",
            features: ["Coffee", "Pastries", "WiFi", "Mountain View"],
            hours: "07:00 - 20:00",
            phone: "+30 26920 22444",
            address: "Central Square, Kalavrita",
            coordinates: { lat: 38.0330, lng: 22.1130 },
            image: "☕",
            highlights: ["Greek Coffee", "Baklava", "Mountain Tea"]
        },
        {
            id: 4,
            name: "Restaurant Panorama",
            type: "Modern",
            description: "Contemporary restaurant with innovative Greek cuisine and panoramic views of the surrounding mountains. Perfect for special occasions.",
            rating: 4.7,
            priceRange: "€€€",
            features: ["Panoramic View", "Modern Cuisine", "Wine Selection", "Romantic"],
            hours: "19:00 - 24:00",
            phone: "+30 26920 22555",
            address: "Hilltop Location, Kalavrita",
            coordinates: { lat: 38.0350, lng: 22.1150 },
            image: "🏔️",
            highlights: ["Truffle Pasta", "Local Wine", "Sunset Views"]
        },
        {
            id: 5,
            name: "Mountain Taverna",
            type: "Traditional",
            description: "Rustic taverna specializing in game meat and traditional mountain dishes. Known for their hearty portions and warm hospitality.",
            rating: 4.5,
            priceRange: "€€",
            features: ["Game Meat", "Hearty Portions", "Fireplace", "Local Spirits"],
            hours: "12:00 - 23:30",
            phone: "+30 26920 22666",
            address: "Mountain Road, Kalavrita",
            coordinates: { lat: 38.0280, lng: 22.1080 },
            image: "🦌",
            highlights: ["Wild Boar", "Mountain Herbs", "Raki"]
        },
        {
            id: 6,
            name: "Sweet Dreams Bakery",
            type: "Cafe",
            description: "Local bakery and cafe famous for traditional Greek sweets, fresh bread, and homemade pastries. A must-visit for dessert lovers.",
            rating: 4.9,
            priceRange: "€",
            features: ["Fresh Bread", "Traditional Sweets", "Coffee", "Takeaway"],
            hours: "06:00 - 18:00",
            phone: "+30 26920 22777",
            address: "Bakery Street 8, Kalavrita",
            coordinates: { lat: 38.0310, lng: 22.1110 },
            image: "🧁",
            highlights: ["Loukoumades", "Galaktoboureko", "Fresh Bread"]
        }
    ],
    
    attractions: [
        {
            id: 1,
            name: "Odontotos Rack Railway",
            type: "Historic",
            description: "The famous cog railway connecting Diakopto to Kalavrita. This engineering marvel offers breathtaking views of the Vouraikos Gorge and is one of the most scenic railway journeys in Greece.",
            rating: 4.9,
            duration: "1.5 hours",
            features: ["Scenic Views", "Historic Railway", "Gorge Views", "Photography"],
            hours: "08:00 - 18:00 (Seasonal)",
            phone: "+30 26920 22200",
            address: "Railway Station, Kalavrita",
            coordinates: { lat: 38.0300, lng: 22.1100 },
            image: "🚂",
            highlights: ["Vouraikos Gorge", "Historic Tunnels", "Mountain Views", "UNESCO Heritage"]
        },
        {
            id: 2,
            name: "Museum of the Kalavryta Holocaust",
            type: "Historic",
            description: "A solemn memorial museum dedicated to the victims of the 1943 Kalavryta massacre. The museum preserves the memory of this tragic event and educates visitors about this dark chapter in Greek history.",
            rating: 4.8,
            duration: "1-2 hours",
            features: ["Historical", "Educational", "Memorial", "Guided Tours"],
            hours: "09:00 - 17:00",
            phone: "+30 26920 22201",
            address: "Museum Street, Kalavrita",
            coordinates: { lat: 38.0320, lng: 22.1120 },
            image: "🏛️",
            highlights: ["Historical Artifacts", "Memorial Hall", "Educational Programs", "Peace Garden"]
        },
        {
            id: 3,
            name: "Vouraikos Canyon",
            type: "Natural",
            description: "A stunning natural gorge carved by the Vouraikos River. Perfect for hiking, photography, and nature observation. The canyon offers dramatic rock formations and diverse wildlife.",
            rating: 4.7,
            duration: "2-4 hours",
            features: ["Hiking", "Nature", "Photography", "Wildlife"],
            hours: "Always Open",
            phone: "N/A",
            address: "Vouraikos Gorge, Kalavrita",
            coordinates: { lat: 38.0250, lng: 22.1050 },
            image: "🏔️",
            highlights: ["Rock Formations", "River Views", "Hiking Trails", "Wildlife Spotting"]
        },
        {
            id: 4,
            name: "Agia Lavra Monastery",
            type: "Religious",
            description: "Historic monastery where the Greek War of Independence began in 1821. This sacred site holds great historical significance and offers beautiful architecture and peaceful surroundings.",
            rating: 4.6,
            duration: "1 hour",
            features: ["Religious", "Historical", "Architecture", "Peaceful"],
            hours: "08:00 - 20:00",
            phone: "+30 26920 22202",
            address: "Monastery Hill, Kalavrita",
            coordinates: { lat: 38.0400, lng: 22.1200 },
            image: "⛪",
            highlights: ["Historic Flag", "Religious Art", "Mountain Views", "Peace Garden"]
        },
        {
            id: 5,
            name: "Cave of the Lakes",
            type: "Natural",
            description: "A unique underground cave system featuring underground lakes and stunning stalactite formations. One of Greece's most impressive cave systems with guided tours available.",
            rating: 4.5,
            duration: "1.5 hours",
            features: ["Cave Tour", "Underground Lakes", "Stalactites", "Guided Tour"],
            hours: "10:00 - 16:00",
            phone: "+30 26920 22203",
            address: "Cave Area, Kalavrita",
            coordinates: { lat: 38.0200, lng: 22.1000 },
            image: "🕳️",
            highlights: ["Underground Lakes", "Stalactite Formations", "Cave Photography", "Geological Wonders"]
        },
        {
            id: 6,
            name: "Ski Center Kalavrita",
            type: "Recreation",
            description: "Modern ski resort offering winter sports and mountain activities. Features ski slopes, snowboarding, and stunning mountain views. Also popular for summer hiking.",
            rating: 4.4,
            duration: "Full Day",
            features: ["Skiing", "Snowboarding", "Mountain Views", "Equipment Rental"],
            hours: "09:00 - 16:00 (Winter)",
            phone: "+30 26920 22204",
            address: "Ski Center, Kalavrita",
            coordinates: { lat: 38.0500, lng: 22.1300 },
            image: "⛷️",
            highlights: ["Ski Slopes", "Mountain Views", "Winter Sports", "Summer Hiking"]
        }
    ],
    
    activities: [
        {
            id: 1,
            name: "Hiking the Vouraikos Trail",
            type: "Outdoor",
            description: "Scenic hiking trail following the historic railway route through the Vouraikos Gorge. Perfect for nature lovers and photography enthusiasts.",
            rating: 4.8,
            duration: "3-4 hours",
            difficulty: "Moderate",
            features: ["Hiking", "Nature", "Photography", "Railway History"],
            season: "Spring, Summer, Fall",
            equipment: "Hiking Boots, Water, Camera",
            price: "Free",
            image: "🥾",
            highlights: ["Gorge Views", "Railway Tunnels", "Wildlife", "Historic Sites"]
        },
        {
            id: 2,
            name: "Railway Journey Experience",
            type: "Cultural",
            description: "Take the historic Odontotos railway from Diakopto to Kalavrita. Experience one of the world's most scenic railway journeys with stunning mountain and gorge views.",
            rating: 4.9,
            duration: "1.5 hours",
            difficulty: "Easy",
            features: ["Scenic Views", "Historic Railway", "Photography", "Relaxing"],
            season: "Year Round",
            equipment: "Camera, Comfortable Clothes",
            price: "€15-25",
            image: "🚂",
            highlights: ["Gorge Views", "Historic Tunnels", "Mountain Scenery", "UNESCO Heritage"]
        },
        {
            id: 3,
            name: "Wine Tasting Tour",
            type: "Culinary",
            description: "Discover local wines and traditional Greek spirits. Visit local wineries and learn about traditional winemaking methods in the Peloponnese region.",
            rating: 4.6,
            duration: "2-3 hours",
            difficulty: "Easy",
            features: ["Wine Tasting", "Local Culture", "Food Pairing", "Education"],
            season: "Year Round",
            equipment: "None Required",
            price: "€30-50",
            image: "🍷",
            highlights: ["Local Wines", "Traditional Methods", "Food Pairing", "Cultural Experience"]
        },
        {
            id: 4,
            name: "Mountain Biking Adventure",
            type: "Adventure",
            description: "Explore Kalavrita's mountain trails on two wheels. Suitable for all skill levels with bike rental and guided tours available.",
            rating: 4.5,
            duration: "2-4 hours",
            difficulty: "Moderate to Hard",
            features: ["Mountain Biking", "Adventure", "Nature", "Exercise"],
            season: "Spring, Summer, Fall",
            equipment: "Bike, Helmet, Water",
            price: "€20-40",
            image: "🚵",
            highlights: ["Mountain Trails", "Scenic Views", "Adventure", "Physical Activity"]
        },
        {
            id: 5,
            name: "Traditional Cooking Class",
            type: "Cultural",
            description: "Learn to cook traditional Greek dishes using local ingredients. Hands-on experience with local chefs teaching authentic recipes and techniques.",
            rating: 4.7,
            duration: "3-4 hours",
            difficulty: "Easy",
            features: ["Cooking", "Local Culture", "Food", "Education"],
            season: "Year Round",
            equipment: "Apron Provided",
            price: "€40-60",
            image: "👨‍🍳",
            highlights: ["Traditional Recipes", "Local Ingredients", "Hands-on Learning", "Cultural Exchange"]
        },
        {
            id: 6,
            name: "Photography Workshop",
            type: "Creative",
            description: "Capture the beauty of Kalavrita through photography. Learn techniques for landscape, nature, and cultural photography with professional guidance.",
            rating: 4.4,
            duration: "4-6 hours",
            difficulty: "Beginner to Advanced",
            features: ["Photography", "Nature", "Learning", "Creative"],
            season: "Year Round",
            equipment: "Camera, Tripod (Optional)",
            price: "€50-80",
            image: "📸",
            highlights: ["Landscape Photography", "Technical Skills", "Creative Vision", "Professional Tips"]
        },
        {
            id: 7,
            name: "Skiing and Snowboarding",
            type: "Winter Sports",
            description: "Hit the slopes at Kalavrita Ski Center. Enjoy skiing and snowboarding with modern facilities and stunning mountain views.",
            rating: 4.3,
            duration: "Full Day",
            difficulty: "All Levels",
            features: ["Skiing", "Snowboarding", "Winter Sports", "Mountain Views"],
            season: "Winter (Dec-Mar)",
            equipment: "Ski/Snowboard Equipment",
            price: "€30-60",
            image: "⛷️",
            highlights: ["Ski Slopes", "Snowboarding", "Mountain Views", "Winter Fun"]
        },
        {
            id: 8,
            name: "Cultural Heritage Walk",
            type: "Cultural",
            description: "Guided walking tour through Kalavrita's historic sites, including the monastery, museum, and traditional architecture. Learn about local history and culture.",
            rating: 4.6,
            duration: "2-3 hours",
            difficulty: "Easy",
            features: ["Walking Tour", "History", "Culture", "Education"],
            season: "Year Round",
            equipment: "Comfortable Walking Shoes",
            price: "€15-25",
            image: "🚶",
            highlights: ["Historic Sites", "Local History", "Cultural Insights", "Guided Experience"]
        }
    ],
    
    // Additional data for enhanced functionality
    categories: {
        restaurants: ["All", "Traditional", "Modern", "Cafe"],
        attractions: ["All", "Historic", "Natural", "Religious", "Recreation"],
        activities: ["All", "Outdoor", "Cultural", "Adventure", "Culinary", "Creative", "Winter Sports"]
    },
    
    // Contact and support information
    support: {
        email: "hello@forcehook.com",
        phone: "+30 26920 22000",
        hours: "09:00 - 18:00 (Mon-Fri)",
        address: "Tourist Information Center, Central Square, Kalavrita"
    },
    
    // App configuration
    config: {
        defaultLanguage: "en",
        supportedLanguages: ["en", "el"],
        currency: "EUR",
        timezone: "Europe/Athens",
        coordinates: {
            lat: 38.0322,
            lng: 22.1123
        }
    }
};

// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = kalavritaData;
}
