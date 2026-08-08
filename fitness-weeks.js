// Fitness week selector functionality
// Fetches training data from Google Sheets and switches between weeks

// Your Google Sheets URL (make sure it's publicly accessible)
const SHEET_URL = 'YOUR_GOOGLE_SHEETS_URL_HERE';

// Parse Google Sheets CSV export
async function fetchWeekData(weekNumber) {
    try {
        // Convert Google Sheets URL to CSV export format
        const sheetId = SHEET_URL.match(/\/d\/(.*?)\//)?.[1];
        if (!sheetId) {
            console.error('Invalid Google Sheets URL');
            return null;
        }

        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        return parseWeekFromCSV(csvText, weekNumber);
    } catch (error) {
        console.error('Error fetching week data:', error);
        return null;
    }
}

// Parse CSV and extract specific week data
function parseWeekFromCSV(csvText, weekNumber) {
    const rows = csvText.split('\n').map(row => row.split(','));

    // Find the week column (adjust based on your sheet structure)
    const weekColumnIndex = weekNumber - 1; // Adjust if needed

    const weekData = {
        week: weekNumber,
        days: []
    };

    // Parse each day's data
    // This needs to be customized based on your specific sheet structure
    // Example structure - you'll need to adjust this
    for (let day = 1; day <= 5; day++) {
        weekData.days.push({
            name: `Day ${day}`,
            mainLift: {
                name: '', // Extract from sheet
                sets: '', // Extract from sheet
                reps: '', // Extract from sheet
                weight: '' // Extract from sheet
            },
            accessories: [], // Extract from sheet
            conditioning: [] // Extract from sheet
        });
    }

    return weekData;
}

// Update the UI with week data
function displayWeek(weekData) {
    if (!weekData) return;

    // Update week number in hero
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = `Week ${weekData.week} - 5 Day Split`;
    }

    // Update each day's content
    const trainingDays = document.querySelectorAll('.training-day');
    trainingDays.forEach((dayElement, index) => {
        if (weekData.days[index]) {
            const dayData = weekData.days[index];

            // Update main lift
            const mainLiftElement = dayElement.querySelector('.main-lift-detail h4');
            if (mainLiftElement) {
                mainLiftElement.textContent = `Main Lift: ${dayData.mainLift.name}`;
            }

            // Update sets info
            const setsElement = dayElement.querySelector('.set-row span:last-child');
            if (setsElement) {
                setsElement.textContent = `${dayData.mainLift.sets} × ${dayData.mainLift.reps} @ ${dayData.mainLift.weight}`;
            }

            // Update accessories
            const accessoriesList = dayElement.querySelector('.accessories-detail .exercise-list');
            if (accessoriesList && dayData.accessories) {
                accessoriesList.innerHTML = dayData.accessories.map(ex =>
                    `<li>${ex}</li>`
                ).join('');
            }

            // Update conditioning
            const conditioningList = dayElement.querySelector('.conditioning-detail .exercise-list');
            if (conditioningList && dayData.conditioning) {
                conditioningList.innerHTML = dayData.conditioning.map(ex =>
                    `<li>${ex}</li>`
                ).join('');
            }
        }
    });
}

// Week selector click handlers
function initWeekSelector() {
    const weekButtons = document.querySelectorAll('.week-btn');

    weekButtons.forEach((button, index) => {
        button.addEventListener('click', async () => {
            const weekNumber = index + 1;

            // Update active state
            weekButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show loading state
            button.disabled = true;
            button.textContent = `Week ${weekNumber}...`;

            // Fetch and display week data
            const weekData = await fetchWeekData(weekNumber);

            // Restore button
            button.disabled = false;
            button.textContent = `Week ${weekNumber}`;

            if (weekData) {
                displayWeek(weekData);
            } else {
                alert(`Unable to load Week ${weekNumber} data. Please check your internet connection.`);
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initWeekSelector);
