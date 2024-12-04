// Experiment Configuration
const config = {
    totalTrials: 8,
    currentTrial: 0,
    currentRatingPhase: 'morph', // 'morph', 'celebrity1', 'celebrity2'
    results: [],
    startTime: null
};

// Example data structure for the trials
const trials = [
    {
        morph: 'morph1.jpg',
        celebrity1: { name: 'Brad Pitt', image: 'brad.jpg' },
        celebrity2: { name: 'Tom Cruise', image: 'tom.jpg' }
    },
    // Add all 8 trials here
];

function startExperiment() {
    config.startTime = Date.now();
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('instructions').classList.remove('hidden');
}

function startTrials() {
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('experiment').classList.remove('hidden');
    showTrial();
}

function showTrial() {
    if (config.currentTrial >= config.totalTrials) {
        showResults();
        return;
    }

    const trial = trials[config.currentTrial];
    updateProgress();
    updateDisplay();
}

function updateDisplay() {
    const trial = trials[config.currentTrial];
    const container = document.getElementById('stimulus-container');
    const prompt = document.getElementById('rating-prompt');
    
    // Reset slider
    document.getElementById('rating-slider').value = 4;

    switch(config.currentRatingPhase) {
        case 'morph':
            container.innerHTML = `<img src="${trial.morph}" alt="Morphed Face">`;
            prompt.textContent = "How pleasing is this face?";
            break;
        case 'celebrity1':
            container.innerHTML = `<img src="${trial.celebrity1.image}" alt="${trial.celebrity1.name}">`;
            prompt.textContent = `How familiar are you with ${trial.celebrity1.name}?`;
            break;
        case 'celebrity2':
            container.innerHTML = `<img src="${trial.celebrity2.image}" alt="${trial.celebrity2.name}">`;
            prompt.textContent = `How familiar are you with ${trial.celebrity2.name}?`;
            break;
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const width = (config.currentTrial / config.totalTrials) * 100;
    progress.style.width = `${width}%`;
    document.getElementById('trial-number').textContent = config.currentTrial + 1;
}

function recordResponse() {
    const rating = parseInt(document.getElementById('rating-slider').value);
    const trial = trials[config.currentTrial];

    switch(config.currentRatingPhase) {
        case 'morph':
            trial.morphRating = rating;
            config.currentRatingPhase = 'celebrity1';
            break;
        case 'celebrity1':
            trial.celebrity1Familiarity = rating;
            config.currentRatingPhase = 'celebrity2';
            break;
        case 'celebrity2':
            trial.celebrity2Familiarity = rating;
            config.currentRatingPhase = 'morph';
            config.currentTrial++;
            break;
    }

    showTrial();
}

function createScatterPlot() {
    // Create data points for scatter plot
    const data = trials.map(trial => ({
        x: (trial.celebrity1Familiarity + trial.celebrity2Familiarity) / 2, // avg familiarity
        y: trial.morphRating // pleasingness
    }));

    // Calculate correlation
    const correlation = calculateCorrelation(data);

    // Create SVG for scatter plot
    // Add plotting code here using data points
    return { data, correlation };
}

function showResults() {
    document.getElementById('experiment').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    const plotData = createScatterPlot();
    const summary = document.getElementById('results-summary');
    
    summary.innerHTML = `
        <div class="results-summary-container">
            <h3>Your Results</h3>
            <div id="scatter-plot" class="scatter-plot">
                <!-- Scatter plot will be rendered here -->
            </div>
            <p>Correlation between familiarity and pleasingness: ${plotData.correlation.toFixed(2)}</p>
            <p>This suggests that ${plotData.correlation < 0 ? 'higher familiarity with celebrities led to lower pleasingness ratings of their morphs' : 'familiarity did not decrease pleasingness ratings as predicted'}.</p>
        </div>`;
}

function downloadResults() {
    // Similar to your original download function
    // But include the morph experiment specific data
    const results = {
        timestamp: new Date().toISOString(),
        trials: trials,
        totalDuration: ((Date.now() - config.startTime) / 1000).toFixed(2) + ' seconds'
    };

    // Download JSON and screenshot as in your original code
}

// Helper functions (correlation calculation etc.)
function calculateCorrelation(data) {
    // Add correlation calculation code here
    return -0.5; // Placeholder
}