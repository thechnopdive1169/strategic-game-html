class Faction {
    constructor(name, color, specialUnits, abilities) {
        this.name = name;
        this.color = color;
        this.specialUnits = specialUnits;
        this.abilities = abilities;
        this.dragonCooldown = 0;
    }

    canSummonDragon() {
        return this.dragonCooldown <= 0;
    }

    summonDragon() {
        if (this.canSummonDragon()) {
            this.dragonCooldown = 60000; // 60 seconds cooldown
            return true;
        }
        return false;
    }
}

const Factions = {
    good: new Faction(
        'good',
        '#0066ff',
        ['roundTableKnight', 'arthur'],
        [
            { name: 'holyLight', cooldown: 30000, effect: 'heal' },
            { name: 'divineShield', cooldown: 45000, effect: 'protection' }
        ]
    ),
    ice: new Faction(
        'ice',
        '#66ccff',
        ['frostGiant', 'iceDragon'],
        [
            { name: 'freeze', cooldown: 25000, effect: 'slow' },
            { name: 'blizzard', cooldown: 40000, effect: 'areaDamage' }
        ]
    ),
    evil: new Faction(
        'evil',
        '#cc0000',
        ['werewolf', 'vampire'],
        [
            { name: 'curse', cooldown: 20000, effect: 'weaken' },
            { name: 'summonBats', cooldown: 35000, effect: 'swarm' }
        ]
    )
};
