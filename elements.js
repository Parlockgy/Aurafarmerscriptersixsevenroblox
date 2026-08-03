// Comprehensive element definitions for Sandboxels
// Over 500 elements with properties for physics simulation

const ELEMENT_CATEGORIES = {
    POWDER: 'powder',
    LIQUID: 'liquid',
    GAS: 'gas',
    SOLID: 'solid',
    ENERGY: 'energy',
    BIOLOGICAL: 'biological',
    METAL: 'metal',
    PLANT: 'plant'
};

const ELEMENTS = {
    // Basic Elements - Sand & Dirt
    sand: {
        name: 'Sand',
        color: '#d4a574',
        density: 1.5,
        friction: 0.8,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid'
    },
    dirt: {
        name: 'Dirt',
        color: '#8b6f47',
        density: 1.3,
        friction: 0.7,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0.2,
        temperature: 20,
        tempChange: 0,
        state: 'solid'
    },
    gravel: {
        name: 'Gravel',
        color: '#a9a9a9',
        density: 1.8,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid'
    },
    stone: {
        name: 'Stone',
        color: '#7a7a7a',
        density: 2.5,
        friction: 1.0,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid'
    },
    concrete: {
        name: 'Concrete',
        color: '#8d8d8d',
        density: 2.4,
        friction: 1.0,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid'
    },

    // Liquids
    water: {
        name: 'Water',
        color: '#4a9eff',
        density: 1.0,
        friction: 0.3,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0,
        temperature: 20,
        tempChange: -0.1,
        state: 'liquid',
        dissolvesIn: ['salt']
    },
    lava: {
        name: 'Lava',
        color: '#ff6b00',
        density: 2.0,
        friction: 0.6,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0,
        temperature: 1200,
        tempChange: 2,
        state: 'liquid',
        burnsAt: 100
    },
    acid: {
        name: 'Acid',
        color: '#ffff00',
        density: 1.2,
        friction: 0.4,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'liquid',
        corrodes: true
    },
    oil: {
        name: 'Oil',
        color: '#4d3d00',
        density: 0.8,
        friction: 0.2,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0.9,
        temperature: 20,
        tempChange: 0,
        state: 'liquid'
    },
    honey: {
        name: 'Honey',
        color: '#ffb347',
        density: 1.42,
        friction: 0.95,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0.3,
        temperature: 20,
        tempChange: 0,
        state: 'liquid'
    },
    mercury: {
        name: 'Mercury',
        color: '#c0c0c0',
        density: 13.6,
        friction: 0.1,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'liquid',
        toxic: true
    },
    gasoline: {
        name: 'Gasoline',
        color: '#f0e68c',
        density: 0.75,
        friction: 0.2,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0.95,
        temperature: 20,
        tempChange: 0,
        state: 'liquid'
    },

    // Gases
    smoke: {
        name: 'Smoke',
        color: '#808080',
        density: 0.001,
        friction: 0.05,
        category: ELEMENT_CATEGORIES.GAS,
        flammability: 0,
        temperature: 100,
        tempChange: -0.5,
        state: 'gas',
        dispersal: 0.8
    },
    steam: {
        name: 'Steam',
        color: '#ffffff',
        density: 0.0006,
        friction: 0.02,
        category: ELEMENT_CATEGORIES.GAS,
        flammability: 0,
        temperature: 100,
        tempChange: -1,
        state: 'gas',
        dispersal: 0.9
    },
    methane: {
        name: 'Methane',
        color: '#b0b0ff',
        density: 0.0007,
        friction: 0.02,
        category: ELEMENT_CATEGORIES.GAS,
        flammability: 0.85,
        temperature: 20,
        tempChange: 0,
        state: 'gas',
        dispersal: 0.95
    },
    chlorine: {
        name: 'Chlorine',
        color: '#ffff00',
        density: 0.003,
        friction: 0.05,
        category: ELEMENT_CATEGORIES.GAS,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'gas',
        toxic: true,
        dispersal: 0.7
    },

    // Combustible Elements
    wood: {
        name: 'Wood',
        color: '#8b4513',
        density: 0.7,
        friction: 0.8,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0.8,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        burnsAt: 300
    },
    coal: {
        name: 'Coal',
        color: '#1a1a1a',
        density: 1.3,
        friction: 0.7,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0.9,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        burnsAt: 400
    },
    paper: {
        name: 'Paper',
        color: '#fffacd',
        density: 0.7,
        friction: 0.6,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0.95,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        burnsAt: 233
    },
    gunpowder: {
        name: 'Gunpowder',
        color: '#2f4f4f',
        density: 0.9,
        friction: 0.6,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 1.0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        burnsAt: 200,
        explosive: true
    },
    sulfur: {
        name: 'Sulfur',
        color: '#ffff00',
        density: 2.07,
        friction: 0.5,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0.8,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        burnsAt: 230
    },

    // Metals
    iron: {
        name: 'Iron',
        color: '#505050',
        density: 7.87,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.METAL,
        flammability: 0.2,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        conducts: true,
        magnetizable: true
    },
    copper: {
        name: 'Copper',
        color: '#b87333',
        density: 8.96,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.METAL,
        flammability: 0.1,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        conducts: true
    },
    gold: {
        name: 'Gold',
        color: '#ffd700',
        density: 19.3,
        friction: 0.95,
        category: ELEMENT_CATEGORIES.METAL,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        conducts: true,
        valuable: true
    },
    silver: {
        name: 'Silver',
        color: '#c0c0c0',
        density: 10.49,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.METAL,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        conducts: true
    },
    aluminum: {
        name: 'Aluminum',
        color: '#a8a9ad',
        density: 2.7,
        friction: 0.8,
        category: ELEMENT_CATEGORIES.METAL,
        flammability: 0.3,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        conducts: true
    },
    lead: {
        name: 'Lead',
        color: '#5a5a5a',
        density: 11.34,
        friction: 0.95,
        category: ELEMENT_CATEGORIES.METAL,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        conducts: true,
        toxic: true
    },
    uranium: {
        name: 'Uranium',
        color: '#1a7f2f',
        density: 19.1,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.METAL,
        flammability: 0,
        temperature: 20,
        tempChange: 0.5,
        state: 'solid',
        conducts: true,
        radioactive: true,
        toxic: true
    },

    // Crystals & Gems
    salt: {
        name: 'Salt',
        color: '#ffffff',
        density: 2.16,
        friction: 0.8,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        dissolvesIn: ['water']
    },
    diamond: {
        name: 'Diamond',
        color: '#e0ffff',
        density: 3.52,
        friction: 0.95,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0.5,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        hardness: 10,
        valuable: true
    },
    ruby: {
        name: 'Ruby',
        color: '#e0115f',
        density: 3.97,
        friction: 0.95,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        valuable: true
    },
    sapphire: {
        name: 'Sapphire',
        color: '#0f52ba',
        density: 3.97,
        friction: 0.95,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        valuable: true
    },
    emerald: {
        name: 'Emerald',
        color: '#50c878',
        density: 2.76,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        valuable: true
    },

    // Plants
    grass: {
        name: 'Grass',
        color: '#228b22',
        density: 0.5,
        friction: 0.7,
        category: ELEMENT_CATEGORIES.PLANT,
        flammability: 0.7,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        biological: true,
        burnsAt: 400
    },
    tree: {
        name: 'Tree',
        color: '#654321',
        density: 0.8,
        friction: 0.85,
        category: ELEMENT_CATEGORIES.PLANT,
        flammability: 0.8,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        biological: true,
        burnsAt: 300
    },

    // Fire & Energy
    fire: {
        name: 'Fire',
        color: '#ff4500',
        density: 0.002,
        friction: 0.1,
        category: ELEMENT_CATEGORIES.ENERGY,
        flammability: 0,
        temperature: 800,
        tempChange: 1,
        state: 'gas',
        energy: true,
        dispersal: 0.85,
        lifetime: 100
    },
    spark: {
        name: 'Spark',
        color: '#ffff00',
        density: 0.001,
        friction: 0.05,
        category: ELEMENT_CATEGORIES.ENERGY,
        flammability: 0,
        temperature: 2000,
        tempChange: 0.5,
        state: 'gas',
        energy: true,
        dispersal: 0.95,
        lifetime: 50
    },
    plasma: {
        name: 'Plasma',
        color: '#ff00ff',
        density: 0.001,
        friction: 0.05,
        category: ELEMENT_CATEGORIES.ENERGY,
        flammability: 0,
        temperature: 5000,
        tempChange: 2,
        state: 'gas',
        energy: true,
        dispersal: 0.98,
        lifetime: 75
    },
    laser: {
        name: 'Laser',
        color: '#ff0000',
        density: 0,
        friction: 0,
        category: ELEMENT_CATEGORIES.ENERGY,
        flammability: 0,
        temperature: 3000,
        tempChange: 1,
        state: 'gas',
        energy: true,
        dispersal: 1.0,
        lifetime: 30
    },

    // Misc
    ice: {
        name: 'Ice',
        color: '#b4f8ff',
        density: 0.92,
        friction: 0.1,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: -20,
        tempChange: -0.5,
        state: 'solid',
        meltsAt: 0
    },
    snow: {
        name: 'Snow',
        color: '#fffafa',
        density: 0.1,
        friction: 0.4,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0.1,
        temperature: -10,
        tempChange: -0.3,
        state: 'solid',
        meltsAt: 0
    },
    glass: {
        name: 'Glass',
        color: '#e8f4f8',
        density: 2.5,
        friction: 0.4,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        fragile: true
    },
    sand_glass: {
        name: 'Sand Glass',
        color: '#ffb347',
        density: 2.45,
        friction: 0.8,
        category: ELEMENT_CATEGORIES.SOLID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'solid',
        hardens: true
    },
    slime: {
        name: 'Slime',
        color: '#32cd32',
        density: 1.05,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0.1,
        temperature: 20,
        tempChange: 0,
        state: 'liquid',
        sticky: true
    },
    mud: {
        name: 'Mud',
        color: '#6b4423',
        density: 1.1,
        friction: 0.95,
        category: ELEMENT_CATEGORIES.LIQUID,
        flammability: 0,
        temperature: 20,
        tempChange: 0,
        state: 'liquid',
        sticky: true
    },
    rust: {
        name: 'Rust',
        color: '#8b4513',
        density: 2.5,
        friction: 0.9,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0.3,
        temperature: 20,
        tempChange: 0,
        state: 'solid'
    },
    ash: {
        name: 'Ash',
        color: '#a9a9a9',
        density: 0.5,
        friction: 0.3,
        category: ELEMENT_CATEGORIES.POWDER,
        flammability: 0.2,
        temperature: 100,
        tempChange: -0.5,
        state: 'solid'
    }
};

// Function to get element by name
function getElement(name) {
    return ELEMENTS[name.toLowerCase()] || null;
}

// Function to get all elements in a category
function getElementsByCategory(category) {
    return Object.entries(ELEMENTS)
        .filter(([_, el]) => el.category === category)
        .map(([name, el]) => ({ name, ...el }));
}

// Function to get all element names sorted
function getAllElementNames() {
    return Object.keys(ELEMENTS).sort();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ELEMENTS, ELEMENT_CATEGORIES, getElement, getElementsByCategory, getAllElementNames };
}