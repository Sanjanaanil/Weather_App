/**
 * Enhanced Weather App JavaScript
 * Features advanced animated backgrounds and smooth transitions
 */

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const weatherCard = document.getElementById('weatherCard');
const themeToggle = document.getElementById('themeToggle');

// Weather data elements
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const datetime = document.getElementById('datetime');
const forecastContainer = document.getElementById('forecastContainer');

// Create animated background container
function createAnimatedBackground() {
    const bgContainer = document.createElement('div');
    bgContainer.className = 'animated-bg';
    bgContainer.id = 'animatedBg';
    document.body.prepend(bgContainer);
    return bgContainer;
}

const animatedBg = createAnimatedBackground();

// Weather-based background animations
const weatherAnimations = {
    clear: function(container) {
        container.className = 'animated-bg bg-clear';
        container.innerHTML = `
            <div class="sun"></div>
            <div class="sun-ray"></div>
        `;
    },
    
    clouds: function(container) {
        container.className = 'animated-bg bg-cloudy';
        container.innerHTML = `
            <div class="cloud"></div>
            <div class="cloud"></div>
            <div class="cloud"></div>
        `;
    },
    
    rain: function(container) {
        container.className = 'animated-bg bg-rain';
        container.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = 0.5 + Math.random() * 0.5 + 's';
            container.appendChild(drop);
        }
    },
    
    snow: function(container) {
        container.className = 'animated-bg bg-snow';
        container.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.innerHTML = '❄️';
            flake.style.left = Math.random() * 100 + '%';
            flake.style.animationDelay = Math.random() * 3 + 's';
            flake.style.animationDuration = 3 + Math.random() * 2 + 's';
            flake.style.fontSize = (10 + Math.random() * 20) + 'px';
            container.appendChild(flake);
        }
    },
    
    thunderstorm: function(container) {
        container.className = 'animated-bg bg-thunder';
        container.innerHTML = `
            <div class="lightning"></div>
        `;
        // Add rain drops
        for (let i = 0; i < 40; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.style.animationDuration = 0.5 + Math.random() * 0.5 + 's';
            container.appendChild(drop);
        }
    },
    
    fog: function(container) {
        container.className = 'animated-bg bg-fog';
        container.innerHTML = `
            <div class="fog"></div>
        `;
    },
    
    night: function(container) {
        container.className = 'animated-bg bg-night';
        container.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = Math.random() * 3 + 'px';
            star.style.height = star.style.width;
            star.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(star);
        }
    }
};

// Update background based on weather and time
function updateAnimatedBackground(weatherDesc, isDay = true) {
    const desc = weatherDesc.toLowerCase();
    const hour = new Date().getHours();
    const isNightTime = hour < 6 || hour > 18;
    
    if (isNightTime && !desc.includes('night')) {
        weatherAnimations.night(animatedBg);
        return;
    }
    
    if (desc.includes('clear')) {
        weatherAnimations.clear(animatedBg);
    } else if (desc.includes('cloud')) {
        weatherAnimations.clouds(animatedBg);
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
        weatherAnimations.rain(animatedBg);
    } else if (desc.includes('snow')) {
        weatherAnimations.snow(animatedBg);
    } else if (desc.includes('thunder')) {
        weatherAnimations.thunderstorm(animatedBg);
    } else if (desc.includes('fog') || desc.includes('mist')) {
        weatherAnimations.fog(animatedBg);
    } else {
        // Default to clear or night based on time
        if (isNightTime) {
            weatherAnimations.night(animatedBg);
        } else {
            weatherAnimations.clear(animatedBg);
        }
    }
}

// Create floating particles for additional effect
function createParticles() {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = 10 + Math.random() * 20 + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        document.body.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Smooth scroll to weather card
function scrollToWeather() {
    weatherCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Enhanced loading animation
function setLoading(isLoading) {
    if (isLoading) {
        loading.classList.remove('hidden');
        weatherCard.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Add pulsing effect to search button
        searchBtn.style.animation = 'pulse 1s infinite';
    } else {
        loading.classList.add('hidden');
        searchBtn.style.animation = '';
    }
}

// Enhanced error display
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    
    // Shake error message
    errorMessage.style.animation = 'none';
    errorMessage.offsetHeight; // Trigger reflow
    errorMessage.style.animation = 'shake 0.5s ease';
}

// Update weather UI with animations
function updateWeatherUI(data) {
    // Add fade out effect
    weatherCard.style.opacity = '0';
    
    setTimeout(() => {
        // Current weather
        cityName.textContent = data.city;
        country.textContent = data.country;
        temperature.textContent = data.temperature;
        feelsLike.textContent = data.feels_like;
        humidity.textContent = data.humidity;
        windSpeed.textContent = data.wind_speed;
        pressure.textContent = data.pressure;
        description.textContent = data.description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
        weatherIcon.alt = data.description;
        
        // Update forecast
        updateForecastUI(data.forecast);
        
        // Update animated background
        updateAnimatedBackground(data.description);
        
        // Fade in
        weatherCard.style.opacity = '1';
        weatherCard.classList.remove('hidden');
        
        // Scroll to weather card
        scrollToWeather();
    }, 300);
}

// Enhanced forecast update with staggered animations
function updateForecastUI(forecast) {
    forecastContainer.innerHTML = '';
    
    forecast.forEach((day, index) => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.style.animation = `slideInUp 0.5s ease ${index * 0.1}s both`;
        
        forecastItem.innerHTML = `
            <div class="forecast-date">${day.date}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}" loading="lazy">
            </div>
            <div class="forecast-temp">${day.temp}°C</div>
            <div class="forecast-desc">${day.description}</div>
            <div style="font-size: 0.8em; margin-top: 5px; opacity: 0.8;">
                <i class="fas fa-tint"></i> ${day.humidity}% 
                <i class="fas fa-wind" style="margin-left: 8px;"></i> ${day.wind_speed} m/s
            </div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Enhanced date/time update with animation
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    // Add fade effect on update
    datetime.style.opacity = '0.5';
    setTimeout(() => {
        datetime.textContent = now.toLocaleDateString('en-US', options);
        datetime.style.opacity = '1';
    }, 100);
}

// Enhanced theme toggle with animation
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Animate toggle button
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
        if (isDark) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.style.background = 'var(--card-dark)';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.style.background = 'var(--card-light)';
        }
        themeToggle.style.transform = 'scale(1)';
    }, 150);
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update background based on theme
    if (!weatherCard.classList.contains('hidden')) {
        const currentDesc = description.textContent;
        updateAnimatedBackground(currentDesc);
    }
}

// Enhanced search function with animations
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        // Shake input if empty
        cityInput.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            cityInput.style.animation = '';
        }, 500);
        showError('Please enter a city name');
        return;
    }
    
    setLoading(true);
    
    try {
        const response = await fetch('/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: city })
        });
        
        const data = await response.json();
        
        if (data.success) {
            updateWeatherUI(data.data);
            updateDateTime();
            // Update date and time every second
            setInterval(updateDateTime, 1000);
        } else {
            showError(data.error);
        }
    } catch (error) {
        showError('Network error. Please check your connection.');
    } finally {
        setLoading(false);
    }
}

// Initialize with welcome animation
function initializeApp() {
    // Set initial background based on time
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) {
        weatherAnimations.night(animatedBg);
    } else {
        weatherAnimations.clear(animatedBg);
    }
    
    // Add entrance animations to elements
    document.querySelector('.app-title').style.animation = 'slideInDown 0.5s ease';
    document.querySelector('.app-subtitle').style.animation = 'slideInUp 0.5s ease 0.2s both';
    
    // Initialize theme
    initTheme();
}

// Call initialization
initializeApp();

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

themeToggle.addEventListener('click', toggleTheme);

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.style.background = 'var(--card-dark)';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.background = 'var(--card-light)';
    }
}

// Add smooth parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    if (weatherCard && !weatherCard.classList.contains('hidden')) {
        weatherCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Reset card position on mouse leave
document.addEventListener('mouseleave', () => {
    if (weatherCard && !weatherCard.classList.contains('hidden')) {
        weatherCard.style.transform = 'translate(0, 0)';
    }
});
// Add this to your existing script.js, or update the datetime function:

// Update date and time separately for better display
function updateDateTime() {
    const now = new Date();
    
    // Date options
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    
    // Time options
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const dateElement = document.getElementById('datetime');
    const clockElement = document.getElementById('clock');
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    }
    
    if (clockElement) {
        clockElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    }
}

// Call this function every second
setInterval(updateDateTime, 1000);