# Coastal Analysis

This folder contains scripts and outputs for analyzing coastal cells in the Azgaar map.

## Scripts

- **`coastal_analyzer.js`** - Identifies all coastal cells from the map data
- **`coastal_selector.js`** - Selects a subset of non-adjacent coastal cells

## Output Files

- **`coastal_cells.json`** - All 3,207 coastal cells identified from the map
- **`selected_coastal_cells.json`** - 1,000 strategically selected coastal cells (no two touching)
- **`rejected_coastal_cells.json`** - 1,239 cells rejected for being too close to selected ones

## Usage

```bash
# Run from the coastal-analysis directory
node coastal_analyzer.js    # Generate initial coastal cells
node coastal_selector.js    # Select 1000 non-adjacent cells
```

## Key Features

- Identifies coastal cells by checking adjacency to ocean features
- Selects cells with minimum 14-unit distance between them
- Prioritizes larger coastal areas for better coverage
- Reduces 3,207 cells to 1,000 for manageable computation
