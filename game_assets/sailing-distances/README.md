# Sailing Distances

This folder contains scripts and outputs for calculating sailing distances between coastal cells.

## Scripts

- **`sailing_distance_calculator.js`** - Calculates sailing distances between coastal cells using Dijkstra's algorithm

## Output Files

- **`sailing_distances.json`** - Detailed sailing routes with paths and distances
- **`sailing_distance_matrix.json`** - Quick lookup matrix for O(1) distance queries

## Usage

```bash
# Run from the sailing-distances directory
node sailing_distance_calculator.js
```

## Key Features

- Uses Dijkstra's algorithm for optimal pathfinding
- Ensures paths never cross land (water-only routes)
- Calculates distances for 1,000 selected coastal cells
- Generates both detailed routes and lookup matrix
- Estimated computation time: ~8 minutes for full matrix

## Performance

- **Input**: 1,000 selected coastal cells
- **Calculations**: 499,500 distance pairs
- **Output**: Complete sailing distance matrix
- **Time**: ~8.3 minutes estimated
