class Building {
    constructor(type, x, y, faction) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.faction = faction;
        this.health = 100;
        this.maxHealth = 100;
        this.completed = false;
        this.constructionProgress = 0;
        this.cost = this.getCost();
        this.resourceGeneration = this.getResourceGeneration();
        this.size = this.getSize();
    }

    getCost() {
        const costs = {
            barracks: { gold: 200, wood: 100, stone: 50 },
            archery: { gold: 150, wood: 80, stone: 30 },
            stable: { gold: 300, wood: 150, stone: 100 },
            woodcamp: { gold: 50, wood: 0, stone: 20 },
            quarry: { gold: 100, wood: 50, stone: 0 },
            farm: { gold: 80, wood: 40, stone: 20 },
            wall: { gold: 10, wood: 0, stone: 20 },
            tower: { gold: 150, wood: 50, stone: 100 },
            gatehouse: { gold: 100, wood: 30, stone: 80 }
        };
        return costs[this.type] || { gold: 0, wood: 0, stone: 0 };
    }

    getResourceGeneration() {
        const generation = {
            woodcamp: { wood: 2 },
            quarry: { stone: 1 },
            farm: { food: 3 }
        };
        return generation[this.type] || {};
    }

    getSize() {
        const sizes = {
            barracks: { width: 3, height: 3 },
            archery: { width: 2, height: 2 },
            stable: { width: 3, height: 3 },
            woodcamp: { width: 2, height: 2 },
            quarry: { width: 2, height: 2 },
            farm: { width: 3, height: 3 },
            wall: { width: 1, height: 1 },
            tower: { width: 2, height: 2 },
            gatehouse: { width: 2, height: 1 }
        };
        return sizes[this.type] || { width: 1, height: 1 };
    }

    update(deltaTime) {
        if (!this.completed) {
            this.constructionProgress += deltaTime * 0.001;
            if (this.constructionProgress >= 1) {
                this.completed = true;
            }
        }
    }

    render(ctx) {
        const alpha = this.completed ? 1 : 0.5;
        
        // Building base
        ctx.fillStyle = this.getFactionColor(this.faction, alpha);
        ctx.fillRect(this.x, this.y, this.size.width * 32, this.size.height * 32);
        
        // Building outline
        ctx.strokeStyle = this.getFactionColor(this.faction, 1);
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.size.width * 32, this.size.height * 32);
        
        // Construction progress
        if (!this.completed) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            ctx.fillRect(this.x, this.y + this.size.height * 32 - 5, 
                        this.size.width * 32 * this.constructionProgress, 5);
        }
        
        // Health bar
        if (this.health < this.maxHealth) {
            const barWidth = this.size.width * 32;
            const barHeight = 4;
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y - 10, barWidth * (this.health / this.maxHealth), barHeight);
        }
        
        // Building icon/text
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type, this.x + (this.size.width * 32) / 2, this.y + (this.size.height * 32) / 2);
    }

    getFactionColor(faction, alpha = 1) {
        const colors = {
            good: `rgba(0, 100, 255, ${alpha})`,
            ice: `rgba(100, 200, 255, ${alpha})`,
            evil: `rgba(200, 0, 0, ${alpha})`
        };
        return colors[faction] || `rgba(128, 128, 128, ${alpha})`;
    }
}
