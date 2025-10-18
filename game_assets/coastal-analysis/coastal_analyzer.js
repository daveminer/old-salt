// Coastal Cell Analyzer for Azgaar's Fantasy Map Generator
// This script helps identify coastal cells in your map export

import fs from 'fs';

function loadMapData(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function analyzeCoastalCells(mapData) {
    const cells = mapData.pack.cells;
    const features = mapData.pack.features;
    
    if (!features) {
        console.log('Features not found in pack');
        return [];
    }
    
    // Create a lookup for features by their terrain type
    const oceanFeatures = features.filter(feature => feature.type === 'ocean');
    const oceanFeatureIds = new Set(oceanFeatures.map(feature => feature.i));
    
    console.log(`Found ${oceanFeatures.length} ocean features`);
    console.log(`Total cells: ${cells.length}`);
    
    const coastalCells = [];
    
    cells.forEach((cell, index) => {
        // Check if this cell is on land
        if (cell.t !== undefined && cell.t !== 0) { // Assuming 0 is water/ocean terrain type
            // Check if any of the cell's neighbors are ocean
            const isCoastal = cell.c && cell.c.some(neighborId => {
                // Check if the neighbor feature is an ocean
                const neighborFeature = features.find(f => f.firstCell <= neighborId && neighborId < f.firstCell + f.cells);
                return neighborFeature && oceanFeatureIds.has(neighborFeature.i);
            });
            
            if (isCoastal) {
                coastalCells.push({
                    cellIndex: index,
                    cellId: cell.i,
                    position: cell.p,
                    height: cell.h,
                    area: cell.area,
                    neighbors: cell.c
                });
            }
        }
    });
    
    return coastalCells;
}

function main() {
    const mapFile = './client/maps/Bouerland Full 2025-10-17-17-32.json';
    
    console.log('Loading map data...');
    const mapData = loadMapData(mapFile);
    
    console.log('Analyzing coastal cells...');
    const coastalCells = analyzeCoastalCells(mapData);
    
    console.log(`\nFound ${coastalCells.length} coastal cells:`);
    console.log('First 10 coastal cells:');
    coastalCells.slice(0, 10).forEach(cell => {
        console.log(`  Cell ${cell.cellId}: position [${cell.position[0]}, ${cell.position[1]}], height: ${cell.height}, area: ${cell.area}`);
    });
    
    // Save results to file
    fs.writeFileSync('coastal_cells.json', JSON.stringify(coastalCells, null, 2));
    console.log('\nCoastal cells saved to coastal_cells.json');
}

main();
