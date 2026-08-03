// Chemical and physical reaction system for Sandboxels

const REACTIONS = {
    // Water reactions
    'water+fire': { result: 'steam', probability: 0.8 },
    'water+lava': { result: 'stone', probability: 0.5 },
    'water+acid': { result: 'water', probability: 0.3 },

    // Fire reactions
    'fire+wood': { result: 'ash', probability: 1.0 },
    'fire+coal': { result: 'ash', probability: 0.9 },
    'fire+paper': { result: 'ash', probability: 1.0 },
    'fire+gunpowder': { result: 'fire', probability: 1.0, explosive: true },
    'fire+oil': { result: 'fire', probability: 0.9 },
    'fire+grass': { result: 'ash', probability: 0.95 },
    'fire+tree': { result: 'ash', probability: 0.9 },
    'fire+sulfur': { result: 'fire', probability: 0.8 },

    // Metal reactions
    'iron+oxygen': { result: 'rust', probability: 0.1 },
    'copper+water': { result: 'rust', probability: 0.05 },

    // Ice reactions
    'ice+fire': { result: 'water', probability: 0.9 },
    'ice+lava': { result: 'stone', probability: 0.7 },
    'ice+heat': { result: 'water', probability: 0.95 },

    // Acid reactions
    'acid+metal': { result: 'rust', probability: 0.5 },
    'acid+stone': { result: 'water', probability: 0.3 },

    // Lava reactions
    'lava+water': { result: 'stone', probability: 0.6 },
    'lava+ice': { result: 'stone', probability: 0.8 },

    // Gunpowder reactions
    'gunpowder+fire': { result: 'fire', probability: 1.0, explosive: true },
    'gunpowder+spark': { result: 'fire', probability: 1.0, explosive: true },

    // Plant reactions
    'grass+fire': { result: 'ash', probability: 1.0 },
    'tree+fire': { result: 'ash', probability: 0.95 },

    // Misc reactions
    'salt+water': { result: 'water', probability: 0.1 },
    'sand+lava': { result: 'glass', probability: 0.7 },
    'coal+fire': { result: 'ash', probability: 0.9 }
};

class ReactionEngine {
    constructor() {
        this.reactionMap = new Map();
        this.initializeReactions();
    }

    initializeReactions() {
        for (const [key, value] of Object.entries(REACTIONS)) {
            this.reactionMap.set(key, value);
        }
    }

    // Check if two elements can react
    canReact(element1, element2) {
        const key1 = `${element1}+${element2}`;
        const key2 = `${element2}+${element1}`;
        return this.reactionMap.has(key1) || this.reactionMap.has(key2);
    }

    // Get reaction result
    getReaction(element1, element2) {
        const key1 = `${element1}+${element2}`;
        const key2 = `${element2}+${element1}`;
        return this.reactionMap.get(key1) || this.reactionMap.get(key2);
    }

    // Execute reaction with probability
    executeReaction(element1, element2) {
        const reaction = this.getReaction(element1, element2);
        if (!reaction) return null;

        if (Math.random() < reaction.probability) {
            return {
                result: reaction.result,
                explosive: reaction.explosive || false
            };
        }
        return null;
    }

    // Check temperature-based state changes
    checkStateChange(element, currentTemp) {
        const el = getElement(element);
        if (!el) return null;

        // Melting
        if (el.meltsAt !== undefined && currentTemp >= el.meltsAt && el.state === 'solid') {
            return { newElement: 'water', newState: 'liquid' };
        }

        // Freezing
        if (el.freezesAt !== undefined && currentTemp <= el.freezesAt && el.state === 'liquid') {
            return { newElement: 'ice', newState: 'solid' };
        }

        // Burning
        if (el.burnsAt !== undefined && currentTemp >= el.burnsAt && el.flammability > 0) {
            return { newElement: 'fire', newState: 'gas' };
        }

        // Evaporation
        if (element === 'water' && currentTemp >= 100 && el.state === 'liquid') {
            return { newElement: 'steam', newState: 'gas' };
        }

        return null;
    }

    // Apply explosion effect
    createExplosion(x, y, power = 1.0) {
        const explosionData = {
            x: x,
            y: y,
            power: power,
            radius: 30 * power,
            force: 10 * power,
            temperature: 2000 * power,
            particles: Math.floor(50 * power)
        };
        return explosionData;
    }

    // Calculate heat transfer between adjacent particles
    transferHeat(fromTemp, toTemp, conductivity = 1.0) {
        const tempDiff = fromTemp - toTemp;
        const transfer = tempDiff * 0.1 * conductivity;
        return Math.max(-50, Math.min(50, transfer)); // Clamp transfer
    }

    // Get all possible reactions for an element
    getReactionsFor(element) {
        const reactions = [];
        for (const [key, value] of this.reactionMap.entries()) {
            if (key.startsWith(element + '+') || key.endsWith('+' + element)) {
                reactions.push({ key, ...value });
            }
        }
        return reactions;
    }
}

// Create global reaction engine
const reactionEngine = new ReactionEngine();

// Temperature-based properties
const TEMPERATURE_EFFECTS = {
    // Temperature ranges that affect element behavior
    freezing: 0,      // Below this, liquids freeze
    boiling: 100,     // Above this, liquids evaporate
    combustion: 200,  // Temperature needed for combustion
    melting: 400,     // Temperature to melt certain solids
    plasma: 5000      // Temperature for plasma state
};

// Function to determine if element conducts heat
function conductHeat(elementName) {
    const el = getElement(elementName);
    return el && el.conducts === true;
}

// Function to check if element is flammable
function isFlammable(elementName) {
    const el = getElement(elementName);
    return el && el.flammability > 0;
}

// Function to check if element is toxic
function isToxic(elementName) {
    const el = getElement(elementName);
    return el && el.toxic === true;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        REACTIONS, 
        ReactionEngine, 
        reactionEngine, 
        TEMPERATURE_EFFECTS,
        conductHeat,
        isFlammable,
        isToxic
    };
}