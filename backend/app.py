from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load configuration from JSON file
config_path = os.path.join(os.path.dirname(__file__), 'config.json')  # Ensure path is correct
with open(config_path) as config_file:
    config = json.load(config_file)

API_KEY = config.get('OPENWEATHERMAP_API_KEY')

if not API_KEY:
    raise ValueError("No API key found in config.json file.")

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'No city provided'}), 400

    weather_url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
    forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric'

    try:
        # Fetch current weather
        weather_response = requests.get(weather_url)
        weather_data = weather_response.json()

        # Fetch 5-day forecast
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()

        if weather_response.status_code != 200 or forecast_response.status_code != 200:
            return jsonify({'error': 'Error fetching weather data'}), 400

        # Current weather information
        weather_info = {
            'temperature': weather_data['main']['temp'],
            'description': weather_data['weather'][0]['description'],
            'humidity': weather_data['main']['humidity'],
            'wind_speed': weather_data['wind']['speed'],
            'icon': weather_data['weather'][0]['icon'],
            'city': weather_data['name'],
            'country': weather_data['sys']['country']
        }

        # 5-day forecast (taking only one forecast per day)
        forecast_info = []
        for forecast in forecast_data['list']:
            if '12:00:00' in forecast['dt_txt']:  # Picking the forecast for midday (12 PM)
                forecast_info.append({
                    'date': forecast['dt_txt'],
                    'temp': forecast['main']['temp'],
                    'icon': forecast['weather'][0]['icon']
                })

        return jsonify({'current': weather_info, 'forecast': forecast_info})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/weather/location', methods=['GET'])
def get_weather_by_location():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if not lat or not lon:
        return jsonify({'error': 'Latitude and longitude are required'}), 400

    weather_url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric'
    forecast_url = f'http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric'

    try:
        # Fetch current weather
        weather_response = requests.get(weather_url)
        weather_data = weather_response.json()

        # Fetch 5-day forecast
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()

        if weather_response.status_code != 200 or forecast_response.status_code != 200:
            return jsonify({'error': 'Error fetching weather data'}), 400

        # Current weather information
        weather_info = {
            'temperature': weather_data['main']['temp'],
            'description': weather_data['weather'][0]['description'],
            'humidity': weather_data['main']['humidity'],
            'wind_speed': weather_data['wind']['speed'],
            'icon': weather_data['weather'][0]['icon'],
            'city': weather_data['name'],
            'country': weather_data['sys']['country']
        }

        # 5-day forecast (taking only one forecast per day)
        forecast_info = []
        for forecast in forecast_data['list']:
            if '12:00:00' in forecast['dt_txt']:  # Picking the forecast for midday (12 PM)
                forecast_info.append({
                    'date': forecast['dt_txt'],
                    'temp': forecast['main']['temp'],
                    'icon': forecast['weather'][0]['icon']
                })

        return jsonify({'current': weather_info, 'forecast': forecast_info})
    except Exception as e:
        app.logger.error(f"Error fetching weather data: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
