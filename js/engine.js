class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = {
            resources: {
                gold: 1000,
                wood: 500,
                stone: 300,
                food: 200,
                honor: 0,
                glory: 0
            },
            buildings: [],
            units: [],
            selectedUnits: [],
            selectedBuilding: null,
            currentFaction: 'good', // good, ice, evil
            gameTime: 0,
            paused: false
        };
        
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.gridSize = 32;
        this.lastTime = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.gameLoop();
        this.startResourceGeneration();
    }

    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Building buttons
        document.querySelectorAll('.build-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectBuilding(e.target.dataset.building));
        });
        
        // Unit buttons
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.spawnUnit(e.target.dataset.unit));
        });
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const worldX = (x / this.camera.zoom) + this.camera.x;
        const worldY = (y / this.camera.zoom) + this.camera.y;
        
        if (this.selectedBuilding) {
            this.placeBuilding(worldX, worldY);
        } else {
            this.selectUnitsAt(worldX, worldY);
        }
    }

    placeBuilding(x, y) {
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);
        
        const building = new Building(
            this.selectedBuilding,
            gridX * this.gridSize,
            gridY * this.gridSize,
            this.gameState.currentFaction
        );
        
        if (this.canAffordBuilding(building) && this.canPlaceBuilding(building)) {
            this.deductResources(building.cost);
            this.gameState.buildings.push(building);
            this.selectedBuilding = null;
            this.updateUI();
        }
    }

    canAffordBuilding(building) {
        const cost = building.cost;
        return this.gameState.resources.gold >= cost.gold &&
               this.gameState.resources.wood >= cost.wood &&
               this.gameState.resources.stone >= cost.stone;
    }

    deductResources(cost) {
        this.gameState.resources.gold -= cost.gold;
        this.gameState.resources.wood -= cost.wood;
        this.gameState.resources.stone -= cost.stone;
        this.updateUI();
    }

    spawnUnit(unitType) {
        const barracks = this.gameState.buildings.find(b => b.type === 'barracks');
        if (barracks && this.canAffordUnit(unitType)) {
            const unit = new Unit(unitType, barracks.x, barracks.y, this.gameState.currentFaction);
            this.deductUnitCost(unit.cost);
            this.gameState.units.push(unit);
        }
    }

    gameLoop(currentTime = 0) {
        if (!this.gameState.paused) {
            const deltaTime = currentTime - this.lastTime;
            this.update(deltaTime);
            this.render();
        }
        this.lastTime = currentTime;
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        this.gameState.gameTime += deltaTime;
        
        // Update units
        this.gameState.units.forEach(unit => unit.update(deltaTime));
        
        // Update buildings
        this.gameState.buildings.forEach(building => building.update(deltaTime));
        
        // Check win conditions
        this.checkWinConditions();
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply camera transform
        this.ctx.translate(-this.camera.x * this.camera.zoom, -this.camera.y * this.camera.zoom);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);
        
        // Render grid
        this.renderGrid();
        
        // Render buildings
        this.gameState.buildings.forEach(building => building.render(this.ctx));
        
        // Render units
        this.gameState.units.forEach(unit => unit.render(this.ctx));
        
        // Restore context state
        this.ctx.restore();
        
        // Render UI elements
        this.renderSelectionBox();
    }

    renderGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const startX = Math.floor(this.camera.x / this.gridSize) * this.gridSize;
        const startY = Math.floor(this.camera.y / this.gridSize) * this.gridSize;
        const endX = startX + (this.canvas.width / this.camera.zoom) + this.gridSize;
        const endY = startY + (this.canvas.height / this.camera.zoom) + this.gridSize;
        
        for (let x = startX; x < endX; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }
        
        for (let y = startY; y < endY; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }

    startResourceGeneration() {
        setInterval(() => {
            if (!this.gameState.paused) {
                // Generate resources from buildings
                this.gameState.buildings.forEach(building => {
                    if (building.resourceGeneration) {
                        Object.keys(building.resourceGeneration).forEach(resource => {
                            this.gameState.resources[resource] += building.resourceGeneration[resource];
                        });
                    }
                });
                
                // Generate honor over time
                this.gameState.resources.honor += 1;
                
                this.updateUI();
            }
        }, 1000);
    }

    updateUI() {
        Object.keys(this.gameState.resources).forEach(resource => {
            const element = document.getElementById(resource);
            if (element) {
                element.querySelector('span').textContent = Math.floor(this.gameState.resources[resource]);
            }
        });
    }
}
