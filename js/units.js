class Unit {
    constructor(type, x, y, faction) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.faction = faction;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = this.getSpeed();
        this.damage = this.getDamage();
        this.range = this.getRange();
        this.cost = this.getCost();
        this.target = null;
        this.path = [];
        this.abilities = this.getAbilities();
        this.cooldowns = {};
    }

    getSpeed() {
        const speeds = {
            spearman: 50,
            archer: 40,
            knight: 80
        };
        return speeds[this.type] || 50;
    }

    getDamage() {
        const damages = {
            spearman: 15,
            archer: 10,
            knight: 25
        };
        return damages[this.type] || 10;
    }

    getRange() {
        const ranges = {
            spearman: 30,
            archer: 150,
            knight: 40
        };
        return ranges[this.type] || 30;
    }

    getCost() {
        const costs = {
            spearman: { gold: 20, honor: 0 },
            archer: { gold: 25, honor: 0 },
            knight: { gold: 50, honor: 10 }
        };
        return costs[this.type] || { gold: 10, honor: 0 };
    }

    getAbilities() {
        const abilities = {
            knight: [
                { name: 'charge', cooldown: 10000, duration: 2000 }
            ]
        };
        return abilities[this.type] || [];
    }

    update(deltaTime) {
        // Update cooldowns
        Object.keys(this.cooldowns).forEach(ability => {
            this.cooldowns[ability] = Math.max(0, this.cooldowns[ability] - deltaTime);
        });
        
        // Move towards target or follow path
        if (this.target) {
            this.moveTowardsTarget(deltaTime);
        } else if (this.path.length > 0) {
            this.followPath(deltaTime);
        }
        
        // Attack if in range
        if (this.target && this.isInRange(this.target)) {
            this.attack(deltaTime);
        }
    }

    moveTowardsTarget(deltaTime) {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.range) {
            const moveX = (dx / distance) * this.speed * deltaTime * 0.001;
            const moveY = (dy / distance) * this.speed * deltaTime * 0.001;
            this.x += moveX;
            this.y += moveY;
        }
    }

    followPath(deltaTime) {
        if (this.path.length === 0) return;
        
        const target = this.path[0];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.path.shift();
        } else {
            const moveX = (dx / distance) * this.speed * deltaTime * 0.001;
            const moveY = (dy / distance) * this.speed * deltaTime * 0.001;
            this.x += moveX;
            this.y += moveY;
        }
    }

    isInRange(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.range;
    }

    attack(deltaTime) {
        // Attack logic would go here
        // This would include damage calculation, health reduction, etc.
    }

    useAbility(abilityName) {
        const ability = this.abilities.find(a => a.name === abilityName);
        if (ability && !this.cooldowns[abilityName]) {
            this.cooldowns[abilityName] = ability.cooldown;
            // Apply ability effects
            this.applyAbilityEffect(ability);
        }
    }

    applyAbilityEffect(ability) {
        switch (ability.name) {
            case 'charge':
                this.speed *= 2;
                setTimeout(() => {
                    this.speed /= 2;
                }, ability.duration);
                break;
        }
    }

    render(ctx) {
        // Unit body
        ctx.fillStyle = this.getFactionColor(this.faction);
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Unit outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Health bar
        if (this.health < this.maxHealth) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - 10, this.y - 15, 20, 3);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - 10, this.y - 15, 20 * (this.health / this.maxHealth), 3);
        }
        
        // Unit type indicator
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type[0].toUpperCase(), this.x, this.y + 3);
    }

    getFactionColor(faction) {
        const colors = {
            good: '#0066ff',
            ice: '#66ccff',
            evil: '#cc0000'
        };
        return colors[faction] || '#888888';
    }
}
