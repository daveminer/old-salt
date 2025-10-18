// Coastal Cell Selector - Target ~1000 cells
// Selects coastal cells with no adjacent ones, targeting ~1000 total

import fs from 'fs';

function loadCoastalCells(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function calculateDistance(pos1, pos2) {
    const dx = pos1[0] - pos2[0];
    const dy = pos1[1] - pos2[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function selectNonAdjacentCoastalCells(coastalCells, targetCount = 1000, minDistance = 14) {
    console.log(`Starting with ${coastalCells.length} coastal cells`);
    console.log(`Target: exactly ${targetCount} selected cells`);
    console.log(`Minimum distance: ${minDistance} units`);
    
    let selectedCells = [];
    let rejectedCells = [];
    
    // Sort cells by area (larger cells first) to prioritize important coastal areas
    const sortedCells = [...coastalCells].sort((a, b) => b.area - a.area);
    
    console.log('Processing cells in order of area (largest first)...');
    
    for (let i = 0; i < sortedCells.length; i++) {
        const currentCell = sortedCells[i];
        let canSelect = true;
        
        // Check if this cell is too close to any already selected cell
        for (const selectedCell of selectedCells) {
            const distance = calculateDistance(currentCell.position, selectedCell.position);
            if (distance < minDistance) {
                canSelect = false;
                break;
            }
        }
        
        if (canSelect) {
            selectedCells.push({
                ...currentCell,
                selectionReason: 'non-adjacent',
                distanceToNearest: selectedCells.length > 0 ? 
                    Math.min(...selectedCells.map(sel => 
                        calculateDistance(currentCell.position, sel.position)
                    )) : 0
            });
            
            // Stop when we reach exactly the target count
            if (selectedCells.length >= targetCount) {
                console.log(`✅ Reached target of ${targetCount} cells!`);
                break;
            }
        } else {
            rejectedCells.push({
                ...currentCell,
                rejectionReason: 'too_close_to_selected'
            });
        }
        
        // Progress indicator
        if (i % 100 === 0) {
            console.log(`Processed ${i}/${sortedCells.length} cells, selected ${selectedCells.length}`);
        }
    }
    
    console.log(`\nFinal selection:`);
    console.log(`- Selected: ${selectedCells.length} cells`);
    console.log(`- Rejected: ${rejectedCells.length} cells`);
    console.log(`- Reduction: ${((rejectedCells.length / coastalCells.length) * 100).toFixed(1)}%`);
    
    return { selectedCells, rejectedCells };
}

function analyzeSelection(selectedCells, rejectedCells) {
    console.log('\n=== SELECTION ANALYSIS ===');
    
    // Area distribution
    const selectedAreas = selectedCells.map(cell => cell.area);
    const rejectedAreas = rejectedCells.map(cell => cell.area);
    
    console.log(`Selected cells - Average area: ${(selectedAreas.reduce((a, b) => a + b, 0) / selectedAreas.length).toFixed(1)}`);
    console.log(`Rejected cells - Average area: ${(rejectedAreas.reduce((a, b) => a + b, 0) / rejectedAreas.length).toFixed(1)}`);
    
    // Distance analysis
    const distances = [];
    for (let i = 0; i < Math.min(selectedCells.length, 100); i++) {
        for (let j = i + 1; j < Math.min(selectedCells.length, 100); j++) {
            const distance = calculateDistance(selectedCells[i].position, selectedCells[j].position);
            distances.push(distance);
        }
    }
    
    if (distances.length > 0) {
        distances.sort((a, b) => a - b);
        console.log(`Minimum distance between selected cells: ${distances[0].toFixed(2)}`);
        console.log(`Average distance between selected cells: ${(distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(2)}`);
    }
    
    // Show some examples
    console.log('\nFirst 10 selected cells:');
    selectedCells.slice(0, 10).forEach((cell, index) => {
        console.log(`  ${index + 1}. Cell ${cell.cellId}: area=${cell.area}, pos=[${cell.position[0].toFixed(1)}, ${cell.position[1].toFixed(1)}]`);
    });
}

function main() {
    const coastalFile = './coastal_cells.json';
    
    console.log('Loading coastal cells...');
    const coastalCells = loadCoastalCells(coastalFile);
    
    console.log('Selecting non-adjacent coastal cells...');
    const { selectedCells, rejectedCells } = selectNonAdjacentCoastalCells(coastalCells, 1000);
    
    // Analyze the selection
    analyzeSelection(selectedCells, rejectedCells);
    
    // Save results
    fs.writeFileSync('./selected_coastal_cells.json', JSON.stringify(selectedCells, null, 2));
    fs.writeFileSync('./rejected_coastal_cells.json', JSON.stringify(rejectedCells, null, 2));
    
    console.log('\nFiles saved:');
    console.log('- selected_coastal_cells.json (selected cells)');
    console.log('- rejected_coastal_cells.json (rejected cells)');
    
    // Calculate potential distance matrix size
    const potentialCalculations = selectedCells.length * (selectedCells.length - 1) / 2;
    const estimatedTime = potentialCalculations / 1000; // rough estimate
    
    console.log(`\nWith ${selectedCells.length} selected cells:`);
    console.log(`- Potential distance calculations: ${potentialCalculations.toLocaleString()}`);
    console.log(`- Estimated computation time: ~${estimatedTime.toFixed(1)} seconds`);
}

main();
