// Photo library with categorization for dynamic homepage
const photoLibrary = {
    // Categories guide photo selection for different layout positions

    cola: [
        'IMG20230612214519.jpg',
        'IMG20240525170510.jpg',
        'IMG20240525170512.jpg',
        'PXL_20241123_184043635.jpg',
        { file: 'PXL_20241225_111451734.jpg', position: 'left center' },
        'PXL_20260426_112034736.MP.jpg'
    ],

    travel: [
        'PXL_20240621_182413420.jpg',
        'PXL_20240623_130244617.jpg',
        'PXL_20250603_124714945.MP.jpg',
        'PXL_20250603_124723036.jpg',
        'PXL_20260426_113434624.jpg',
        'PXL_20260529_115641181.jpg',
        'PXL_20260529_124830410.jpg',
        'PXL_20260529_125914582.jpg',
        'PXL_20260730_190306988.jpg',
        'PXL_20260730_191057451.jpg',
        'PXL_20260803_093838587.MP.jpg'
    ],

    outdoors: [
        'IMG-20230709-WA0028.jpg',
        'IMG20230727165651.jpg',
        'PXL_20250914_112643626.jpg',
        'PXL_20260528_145701882.jpg',
        'PXL_20260730_112726113.MP.jpg',
        'PXL_20260731_080715519.MP.jpg',
        'PXL_20260731_091122884.jpg',
        'PXL_20260731_092052604.jpg',
        'PXL_20260731_094632842.jpg',
        'PXL_20260731_095002270.jpg',
        'PXL_20260804_092619145.jpg',
        'PXL_20260804_092926380.MP.jpg'
    ],

    people: [
        'IMG20230728225947.jpg',
        'IMG20240101144822.jpg',
        'IMG20240303121011.jpg',
        'IMG-20260619-WA0069.jpg',
        'IMG-20260620-WA0083.jpg',
        'IMG-20260620-WA0095.jpg',
        'IMG-20260620-WA0096.jpg',
        'PXL_20240818_153334452.PORTRAIT.jpg',
        'PXL_20250807_085539810.jpg',
        'PXL_20250807_085806261.MP.jpg',
        'PXL_20260426_112108571.jpg',
        'PXL_20260426_112109496.jpg',
        'PXL_20260426_113916149.MP.jpg',
        'PXL_20260804_092856070.MP.jpg'
    ],

    landscapes: [
        'PXL_20260731_091122884.jpg',
        'PXL_20260731_092052604.jpg',
        'PXL_20260804_092619145.jpg',
        'PXL_20260731_094632842.jpg',
        'PXL_20260528_145701882.jpg'
    ],

    fitness: [
        'IMG-20260619-WA0069.jpg',
        'PXL_20240818_153334452.PORTRAIT.jpg',
        'IMG-20260620-WA0108.jpg'
    ],

    candid: [
        'DSC_1021.JPG',
        'IMG20240329140054.jpg',
        'IMG20240329140120.jpg',
        'PXL_20241024_110921542.PORTRAIT.jpg',
        'PXL_20250914_112655396.PORTRAIT.jpg',
        'PXL_20250914_112657924.PORTRAIT.jpg',
        'PXL_20260124_105707968.PORTRAIT.jpg',
        'PXL_20260426_113916927.jpg',
        'PXL_20260804_173429870.jpg'
    ]
};

// Layout slots define what type of photo should go in each position
const photoSlots = [
    { id: 'cola-hero', categories: ['cola'], aspect: 'portrait', size: 'large', caption: 'This is Cola. He\'s in charge.' },
    { id: 'travel-wide', categories: ['travel', 'landscapes'], aspect: 'landscape', size: 'wide' },
    { id: 'cola-small', categories: ['cola'], aspect: 'portrait', size: 'medium' },
    { id: 'hiking-moment', categories: ['outdoors', 'people'], aspect: 'portrait', size: 'large', text: 'Spending time outdoors, usually with a dog who thinks every walk is a multi-day expedition.' },
    { id: 'landscape', categories: ['landscapes', 'outdoors', 'travel'], aspect: 'landscape', size: 'wide' },
    { id: 'fitness-photo', categories: ['fitness', 'people'], aspect: 'portrait', size: 'medium' },
    { id: 'group-shot', categories: ['people'], aspect: 'portrait', size: 'large' },
    { id: 'professional-photo', categories: ['travel', 'people'], aspect: 'portrait', size: 'medium' },
    { id: 'travel-pair-1', categories: ['travel', 'people'], aspect: 'square', size: 'small' },
    { id: 'travel-pair-2', categories: ['outdoors', 'landscapes'], aspect: 'square', size: 'small' },
    { id: 'cola-cosy', categories: ['cola'], aspect: 'portrait', size: 'medium', caption: 'Told you he was photogenic.', locked: true }
];

// Select photos avoiding duplicates and ensuring variety
function selectPhotos() {
    const selected = new Map();
    const usedPhotos = new Set();
    const categoryUsage = {};

    // Initialize category usage tracking
    Object.keys(photoLibrary).forEach(cat => categoryUsage[cat] = 0);

    // Shuffle helper
    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Normalize photo entries (handle both strings and objects)
    function normalizePhoto(entry) {
        if (typeof entry === 'string') {
            return { file: entry, position: null };
        }
        return entry;
    }

    function getPhotoFile(entry) {
        return typeof entry === 'string' ? entry : entry.file;
    }

    // Select photo for each slot
    photoSlots.forEach(slot => {
        // For locked slots (like final Cola photo), ensure it's always from its primary category
        const categoriesToUse = slot.locked ? [slot.categories[0]] : slot.categories;

        // Build candidate pool from allowed categories
        let candidates = [];
        categoriesToUse.forEach(category => {
            if (photoLibrary[category]) {
                photoLibrary[category].forEach(photo => {
                    const photoFile = getPhotoFile(photo);
                    if (!usedPhotos.has(photoFile)) {
                        candidates.push(photo);
                    }
                });
            }
        });

        // Remove duplicates by filename and shuffle
        const seen = new Set();
        candidates = candidates.filter(photo => {
            const file = getPhotoFile(photo);
            if (seen.has(file)) return false;
            seen.add(file);
            return true;
        });
        candidates = shuffle(candidates);

        // Select first available photo
        if (candidates.length > 0) {
            const selectedEntry = candidates[0];
            const normalized = normalizePhoto(selectedEntry);

            selected.set(slot.id, {
                photo: normalized.file,
                position: normalized.position,
                caption: slot.caption || null,
                text: slot.text || null
            });
            usedPhotos.add(normalized.file);

            // Track category usage
            categoriesToUse.forEach(cat => {
                if (photoLibrary[cat]) {
                    const categoryFiles = photoLibrary[cat].map(getPhotoFile);
                    if (categoryFiles.includes(normalized.file)) {
                        categoryUsage[cat]++;
                    }
                }
            });
        }
    });

    return selected;
}

// Apply selected photos to the page
function applyPhotos() {
    const selected = selectPhotos();

    selected.forEach((data, slotId) => {
        const element = document.getElementById(slotId);
        if (!element) return;

        const img = element.querySelector('[data-dynamic-photo]');
        if (img) {
            const imgSrc = `images/home/${data.photo}`;

            // Handle image load errors gracefully
            img.onerror = function() {
                console.warn(`Failed to load image: ${imgSrc}`);
                // Keep the placeholder/fallback visible
            };

            // Set src and alt - this triggers the image load
            img.src = imgSrc;
            img.alt = data.caption || 'Photo from Laurie\'s life';

            // Apply custom object-position if specified
            if (data.position) {
                img.style.objectPosition = data.position;
            } else {
                img.style.objectPosition = 'center';
            }

            // Add loading="lazy" for images further down
            const slotIndex = photoSlots.findIndex(s => s.id === slotId);
            if (slotIndex > 2) {
                img.loading = 'lazy';
            }

            // Remove data attribute after processing
            img.removeAttribute('data-dynamic-photo');
        }

        // Update caption if present
        if (data.caption) {
            const captionEl = element.querySelector('.photo-caption');
            if (captionEl) {
                captionEl.textContent = data.caption;
            }
        }

        // Update text if present
        if (data.text) {
            const textEl = element.querySelector('.story-text p');
            if (textEl) {
                textEl.textContent = data.text;
            }
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPhotos);
} else {
    applyPhotos();
}
