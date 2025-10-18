// Sailing Distance Calculator for Azgaar's Fantasy Map Generator
// Computes direct sailing distances between coastal cells, avoiding land

import fs from 'fs';

function loadMapData(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function loadCoastalCells(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function createWaterGraph(mapData, coastalCells) {
    const cells = mapData.pack.cells;
    const features = mapData.pack.features;
    
    // Create a map of cell ID to coastal cell data
    const coastalCellMap = new Map();
    coastalCells.forEach(cell => {
        coastalCellMap.set(cell.cellId, cell);
    });
    
    // Create adjacency list for water connections
    const waterGraph = new Map();
    
    // Initialize all coastal cells
    coastalCells.forEach(cell => {
        waterGraph.set(cell.cellId, []);
    });
    
    // Find water connections between coastal cells
    coastalCells.forEach(cell => {
        const cellData = cells[cell.cellIndex];
        if (!cellData || !cellData.c) return;
        
        // Check each neighbor
        cellData.c.forEach(neighborId => {
            const neighborCell = cells[neighborId];
            if (!neighborCell) return;
            
            // Check if neighbor is also coastal
            if (coastalCellMap.has(neighborId)) {
                // Calculate distance between cells
                const distance = calculateDistance(
                    cellData.p, 
                    neighborCell.p
                );
                
                // Add bidirectional connection
                if (!waterGraph.has(cell.cellId)) {
                    waterGraph.set(cell.cellId, []);
                }
                if (!waterGraph.has(neighborId)) {
                    waterGraph.set(neighborId, []);
                }
                
                waterGraph.get(cell.cellId).push({
                    target: neighborId,
                    distance: distance
                });
                
                waterGraph.get(neighborId).push({
                    target: cell.cellId,
                    distance: distance
                });
            }
        });
    });
    
    return waterGraph;
}

function calculateDistance(pos1, pos2) {
    const dx = pos1[0] - pos2[0];
    const dy = pos1[1] - pos2[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function dijkstra(graph, start, end) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    
    // Initialize distances
    for (const node of graph.keys()) {
        distances.set(node, Infinity);
        previous.set(node, null);
        unvisited.add(node);
    }
    distances.set(start, 0);
    
    while (unvisited.size > 0) {
        // Find unvisited node with smallest distance
        let current = null;
        let minDistance = Infinity;
        for (const node of unvisited) {
            if (distances.get(node) < minDistance) {
                minDistance = distances.get(node);
                current = node;
            }
        }
        
        if (current === null || current === end) break;
        unvisited.delete(current);
        
        // Update neighbors
        const neighbors = graph.get(current) || [];
        for (const neighbor of neighbors) {
            if (!unvisited.has(neighbor.target)) continue;
            
            const alt = distances.get(current) + neighbor.distance;
            if (alt < distances.get(neighbor.target)) {
                distances.set(neighbor.target, alt);
                previous.set(neighbor.target, current);
            }
        }
    }
    
    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== null) {
        path.unshift(current);
        current = previous.get(current);
    }
    
    return {
        distance: distances.get(end),
        path: path
    };
}

function calculateAllSailingDistances(mapData, coastalCells, maxCells = 100) {
    console.log('Creating water graph...');
    const waterGraph = createWaterGraph(mapData, coastalCells);
    
    console.log(`Water graph has ${waterGraph.size} nodes`);
    
    // Limit to first maxCells for performance
    const limitedCoastalCells = coastalCells.slice(0, maxCells);
    const results = [];
    
    console.log(`Calculating distances for ${limitedCoastalCells.length} cells...`);
    
    for (let i = 0; i < limitedCoastalCells.length; i++) {
        for (let j = i + 1; j < limitedCoastalCells.length; j++) {
            const start = limitedCoastalCells[i].cellId;
            const end = limitedCoastalCells[j].cellId;
            
            const result = dijkstra(waterGraph, start, end);
            
            if (result.distance !== Infinity) {
                results.push({
                    from: start,
                    to: end,
                    distance: result.distance,
                    path: result.path,
                    fromPos: limitedCoastalCells[i].position,
                    toPos: limitedCoastalCells[j].position
                });
            }
        }
        
        // Progress indicator
        if (i % 10 === 0) {
            console.log(`Processed ${i}/${limitedCoastalCells.length} cells`);
        }
    }
    
    return results;
}

function main() {
    const mapFile = '../maps/Bouerland Full 2025-10-17-17-32.json';
    const coastalFile = '../coastal-analysis/selected_coastal_cells.json';
    
    console.log('Loading map and coastal cell data...');
    const mapData = loadMapData(mapFile);
    const coastalCells = loadCoastalCells(coastalFile);
    
    console.log(`Found ${coastalCells.length} coastal cells`);
    
    // Calculate distances (limited to first 200 cells for performance)
    // Note: This is O(n²) so 200 cells = 40,000 calculations vs 3,207 cells = 10.3M calculations
    const sailingDistances = calculateAllSailingDistances(mapData, coastalCells, 200);
    
    console.log(`\nCalculated ${sailingDistances.length} sailing distances`);
    
    // Show some examples
    console.log('\nSample sailing distances:');
    sailingDistances.slice(0, 10).forEach(result => {
        console.log(`From cell ${result.from} to cell ${result.to}: ${result.distance.toFixed(2)} units`);
        console.log(`  Path: ${result.path.join(' -> ')}`);
    });
    
    // Save results
    fs.writeFileSync('./sailing_distances.json', JSON.stringify(sailingDistances, null, 2));
    console.log('\nSailing distances saved to sailing_distances.json');
    
    // Create a distance matrix for easy lookup
    const distanceMatrix = {};
    sailingDistances.forEach(result => {
        if (!distanceMatrix[result.from]) {
            distanceMatrix[result.from] = {};
        }
        distanceMatrix[result.from][result.to] = result.distance;
        
        // Add reverse direction
        if (!distanceMatrix[result.to]) {
            distanceMatrix[result.to] = {};
        }
        distanceMatrix[result.to][result.from] = result.distance;
    });
    
    fs.writeFileSync('./sailing_distance_matrix.json', JSON.stringify(distanceMatrix, null, 2));
    console.log('Distance matrix saved to sailing_distance_matrix.json');
}

main();
