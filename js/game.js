// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    
    // Make game globally accessible for debugging
    window.game = game;
    
    // Setup faction selection
    setupFactionSelection();
    
    // Setup keyboard controls
    setupKeyboardControls();
});

function setupFactionSelection() {
    const factionButtons = document.querySelectorAll('.faction-btn');
    factionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const faction = e.target.dataset.faction;
            game.gameState.currentFaction = faction;
            updateFactionUI(faction);
        });
    });
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case ' ':
                game.gameState.paused = !game.gameState.paused;
                break;
            case 'Escape':
                game.selectedBuilding = null;
                game.gameState.selectedUnits = [];
                break;
            case 'Delete':
                // Delete selected units
                game.gameState.selectedUnits.forEach(unit => {
                    const index = game.gameState.units.indexOf(unit);
                    if (index > -1) {
                        game.gameState.units.splice(index, 1);
                    }
                });
                game.gameState.selectedUnits = [];
                break;
        }
    });
}

function updateFactionUI(faction) {
    const factionInfo = Factions[faction];
    document.body.style.backgroundColor = factionInfo.color + '20';
    
    // Update building panel based on faction
    updateBuildingPanel(faction);
    
    // Update unit panel based on faction
    updateUnitPanel(faction);
}

function updateBuildingPanel(faction) {
    // Show/hide faction-specific buildings
    const factionBuildings = {
        good: ['roundTable'],
        ice: ['iceShrine'],
        evil: ['vampireLair']
    };
    
    // Implementation would show/hide appropriate buildings
}

function updateUnitPanel(faction) {
    // Update unit buttons based on faction special units
    const factionUnits = Factions[faction].specialUnits;
    
    // Implementation would update unit recruitment buttons
}
