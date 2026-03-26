"""
Weather Forecasting Web Application
Built with Flask and OpenWeatherMap API
"""

from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# OpenWeatherMap API configuration
API_KEY = os.getenv('OPENWEATHER_API_KEY')
BASE_URL = BASE_URL = "https://api.openweathermap.org/data/2.5"
print("API KEY:", API_KEY)

def get_weather_data(city):
    """
    Fetch current weather data from OpenWeatherMap API
    
    Args:
        city (str): Name of the cit
    
    Returns:
        dict: Weather data or error message
    """
    try:
        # Current weather endpoint
        current_url = f"{BASE_URL}/weather"
        current_params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'  # For Celsius
        }
        
        current_response = requests.get(current_url, params=current_params)
        current_response.raise_for_status()
        current_data = current_response.json()
        
        # 5-day forecast endpoint
        forecast_url = f"{BASE_URL}/forecast"
        forecast_params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric',
            'cnt': 40  # 5 days * 8 measurements per day
        }
        
        forecast_response = requests.get(forecast_url, params=forecast_params)
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()
        
        # Process forecast data (get one forecast per day at noon)
        daily_forecasts = []
        seen_dates = set()
        
        for item in forecast_data['list']:
            date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
            if date not in seen_dates and len(daily_forecasts) < 5:
                seen_dates.add(date)
                daily_forecasts.append({
                    'date': datetime.fromtimestamp(item['dt']).strftime('%a, %b %d'),
                    'temp': round(item['main']['temp']),
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed']
                })
        
        # Prepare current weather data
        weather_info = {
            'city': current_data['name'],
            'country': current_data['sys']['country'],
            'temperature': round(current_data['main']['temp']),
            'feels_like': round(current_data['main']['feels_like']),
            'humidity': current_data['main']['humidity'],
            'wind_speed': current_data['wind']['speed'],
            'description': current_data['weather'][0]['description'].capitalize(),
            'icon': current_data['weather'][0]['icon'],
            'pressure': current_data['main']['pressure'],
            'forecast': daily_forecasts
        }
        
        return {'success': True, 'data': weather_info}
    
    except requests.exceptions.HTTPError as e:
        if current_response.status_code == 404:
            return {'success': False, 'error': 'City not found. Please check the city name.'}
        else:
            return {'success': False, 'error': 'Error fetching weather data. Please try again.'}
    
    except Exception as e:
        return {'success': False, 'error': 'An unexpected error occurred. Please try again.'}

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def weather():
    """API endpoint to get weather data"""
    city = request.json.get('city', '').strip()
    
    if not city:
        return jsonify({'success': False, 'error': 'Please enter a city name.'})
    
    result = get_weather_data(city)
    return jsonify(result)

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)