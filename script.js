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
        morph: './morphs/ChrisHemsworth_ZacEfron.png',
        celebrity1: { name: 'Chris Hemsworth', image: './originals/ChrisHemsworth.png' },
        celebrity2: { name: 'Zac Efron', image: './originals/ZacEfron.png' }
    },
    {
        morph: './morphs/EmmaWatson_ZiyiZhang.png',
        celebrity1: { name: 'Emma Watson', image: './originals/EmmaWatson.png' },
        celebrity2: { name: 'Ziyi Zhang', image: './originals/ZiyiZhang.png' }
    },
    {
        morph: './morphs/HughJackman_GeorgeClooney.png',
        celebrity1: { name: 'Hugh Jackman', image: './originals/HughJackman.png' },
        celebrity2: { name: 'George Clooney', image: './originals/GeorgeClooney.png' }
    },
    {
        morph: './morphs/KristenStewart_LucyLiu.png',
        celebrity1: { name: 'Kristen Stewart', image: './originals/KristenStewart.png' },
        celebrity2: { name: 'Lucy Liu', image: './originals/LucyLiu.png' }
    },
    {
        morph: './morphs/RobertPattinson_AaronPaul.png',
        celebrity1: { name: 'Robert Pattinson', image: './originals/RobertPattinson.png' },
        celebrity2: { name: 'Aaron Paul', image: './originals/AaronPaul.png' }
    },
    {
        morph: './morphs/ShawnMendes_TrevorNoah.png',
        celebrity1: { name: 'Shawn Mendes', image: './originals/ShawnMendes.png' },
        celebrity2: { name: 'Trevor Noah', image: './originals/TrevorNoah.png' }
    },
    {
        morph: './morphs/VanessaHudgens_RebeccaFerguson.png',
        celebrity1: { name: 'Vanessa Hudgens', image: './originals/VanessaHudgens.png' },
        celebrity2: { name: 'Rebecca Ferguson', image: './originals/RebeccaFerguson.png' }
    },
    {
        morph: './morphs/Zendaya_TaylorHill.png',
        celebrity1: { name: 'Zendaya', image: './originals/Zendaya.png' },
        celebrity2: { name: 'Taylor Hill', image: './originals/TaylorHill.png' }
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
            prompt.innerHTML = `<div class="prompt-text"><h3>How pleasing is this face?</h3></div>`;
            break;
        case 'celebrity1':
            container.innerHTML = `<img src="${trial.celebrity1.image}" alt="${trial.celebrity1.name}">`;
            prompt.innerHTML = `<div class="prompt-text"><h3>How familiar are you with&nbsp;<span class="celebrity-name"> ${trial.celebrity1.name}</span> ?</h3></div>`;
            break;
        case 'celebrity2':
            container.innerHTML = `<img src="${trial.celebrity2.image}" alt="${trial.celebrity2.name}">`;
            prompt.innerHTML = `<div class="prompt-text"><h3>How familiar are you with&nbsp; <span class="celebrity-name"> ${trial.celebrity2.name}</span> ?</h3></div>`;
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

    console.log("Recording response:", {
        phase: config.currentRatingPhase,
        rating: rating,
        trialNumber: config.currentTrial
    });

    switch(config.currentRatingPhase) {
        case 'morph':
            trial.morphRating = rating;
            console.log("Recorded morph rating:", trial.morphRating);
            config.currentRatingPhase = 'celebrity1';
            break;
        case 'celebrity1':
            trial.celebrity1Familiarity = rating;
            console.log("Recorded celebrity1 familiarity:", trial.celebrity1Familiarity);
            config.currentRatingPhase = 'celebrity2';
            break;
        case 'celebrity2':
            trial.celebrity2Familiarity = rating;
            console.log("Recorded celebrity2 familiarity:", trial.celebrity2Familiarity);
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
    // Hide experiment screen, show results screen
    document.getElementById('experiment').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    // Prepare data for scatter plot
    const scatterData = trials.map(trial => ({
        x: (trial.celebrity1Familiarity + trial.celebrity2Familiarity) / 2,
        y: trial.morphRating
    }));

    // Calculate all statistics first
    const correlation = calculateCorrelation(scatterData);
    const avgFamiliarity = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
    const avgPleasingness = scatterData.reduce((sum, point) => sum + point.y, 0) / scatterData.length;
    const correlationStrength = Math.abs(correlation) > 0.7 ? "strong" : 
                               Math.abs(correlation) > 0.3 ? "moderate" : 
                               "weak";

    // Set up results HTML structure
    const resultsContainer = document.getElementById('results-summary');
    resultsContainer.innerHTML = `
        <div class="results-summary-container">
            <h3>Your Results</h3>
            <div class="scatter-plot">
                <canvas id="scatterChart"></canvas>
            </div>
            <div class="analysis-section">
                <h3>Results Analysis</h3>
                <p>Your data shows a ${correlationStrength} ${correlation < 0 ? 'negative' : 'positive'} correlation (${correlation.toFixed(2)}) between celebrity familiarity and morph pleasingness ratings.</p><br>
                <p>On average, you rated your familiarity with the celebrity pairs as ${avgFamiliarity.toFixed(1)} out of 7, and found the morphed faces to have an average pleasingness of ${avgPleasingness.toFixed(1)} out of 7.</p><br>
                <p>${correlation < 0 ? 
                    "Your results support Halberstadt's findings: morphed faces were rated as less pleasing when the original celebrities were more familiar to you." : 
                    "Your results show a different pattern from Halberstadt's findings, suggesting that familiarity with the original celebrities did not decrease your pleasingness ratings of the morphs."}</p>
            </div>
        </div>
    `;
    
        const ctx = document.getElementById('scatterChart').getContext('2d');
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    data: scatterData,
                    backgroundColor: '#05f100',
                    borderColor: '#05f100',
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Celebrity Morph Ratings vs. Familiarity',
                        font: {
                            family: 'Space Grotesk',
                            size: 20,
                            weight: 400
                        },
                        padding: 20,
                        color: '#111111'
                    },
                    tooltip: {
                        backgroundColor: 'white',
                        titleColor: '#111111',
                        bodyColor: '#111111',
                        borderColor: '#05f100',
                        borderWidth: 2,
                        padding: 12,
                        titleFont: {
                            family: 'Space Grotesk',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Space Grotesk',
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                return `Familiarity: ${context.parsed.x.toFixed(1)}, Rating: ${context.parsed.y.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Average Familiarity with Original Celebrities',
                            font: {
                                family: 'Space Grotesk',
                                size: 16,
                                weight: 400
                            }
                        },
                        min: 1,
                        max: 7,
                        ticks: {
                            font: {
                                family: 'Space Grotesk',
                                size: 14
                            }
                        },
                        grid: {
                            color: '#EEEEEE'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Pleasingness Rating of Morph',
                            font: {
                                family: 'Space Grotesk',
                                size: 16,
                                weight: 400
                            }
                        },
                        min: 1,
                        max: 7,
                        ticks: {
                            font: {
                                family: 'Space Grotesk',
                                size: 14
                            }
                        },
                        grid: {
                            color: '#EEEEEE'
                        }
                    }
                },
                backgroundColor: 'white'
            }
        });
    }

    function calculateCorrelation(data) {
        // First check if we have valid data
        if (!data || data.length === 0) {
            console.log("No data available for correlation calculation");
            return 0;
        }
    
        // Log the data to see what we're working with
        console.log("Data for correlation:", data);
    
        const n = data.length;
        const sumX = data.reduce((acc, point) => acc + (point.x || 0), 0);
        const sumY = data.reduce((acc, point) => acc + (point.y || 0), 0);
        const sumXY = data.reduce((acc, point) => acc + ((point.x || 0) * (point.y || 0)), 0);
        const sumXX = data.reduce((acc, point) => acc + ((point.x || 0) * (point.x || 0)), 0);
        const sumYY = data.reduce((acc, point) => acc + ((point.y || 0) * (point.y || 0)), 0);
    
        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = Math.sqrt(((n * sumXX) - (sumX * sumX)) * ((n * sumYY) - (sumY * sumY)));
        
        // Check if denominator is 0 or if calculation results in NaN
        if (denominator === 0 || isNaN(numerator/denominator)) {
            console.log("Invalid correlation calculation");
            return 0;
        }
        
        return numerator / denominator;
    }

    function downloadResults() {
        const results = {
            timestamp: new Date().toISOString(),
            trials: trials,
            totalDuration: ((Date.now() - config.startTime) / 1000).toFixed(2) + ' seconds'
        };
    
        // Download JSON
        const jsonBlob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const jsonUrl = window.URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = 'celebrity-morphs-results.json';
        jsonLink.click();
        window.URL.revokeObjectURL(jsonUrl);
    
        // Get the chart canvas
        const chartCanvas = document.getElementById('scatterChart');
        const chartImage = chartCanvas.toDataURL('image/png');
        
        // Create download link for chart
        const chartLink = document.createElement('a');
        chartLink.href = chartImage;
        chartLink.download = 'celebrity-morphs-results.png';
        chartLink.click();
    }