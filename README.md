# Weather App

This Weather App provides a detailed weather dashboard, where users can view weather information for various cities and different days. The app supports city selection, daily rollup trends, historical weather data, and real-time alerts. The backend periodically fetches weather data from an external API using a cron job and stores the data in a PostgreSQL database.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Architecture](#project-architecture)
- [Setup Instructions](#setup-instructions)
- [Docker Setup](#docker-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Project Overview

This weather app retrieves and displays weather information from various cities, offering users:
- Real-time temperature, feels-like temperature, and weather conditions.
- Summary statistics of average, maximum, and minimum temperatures for each selected city and day.
- Graphical representation of weather trends over multiple days.
- Alerts for specific weather conditions (e.g., heatwaves).
- Support for temperature unit conversions (Celsius/Fahrenheit).

The backend API fetches this data from a third-party weather service at regular intervals using a **cron job**, and stores it in a PostgreSQL database for historical data tracking. The frontend visualizes the data using graphs and tables.

## Features

- **City-based weather insights**: Select cities like Hyderabad, Delhi, Mumbai, and more.
- **Daily summaries**: Choose weather data for today, yesterday, or the day before yesterday.
- **Real-time and historical data**: View current weather details, as well as historical trends with visualizations.
- **Alerts system**: Displays weather alerts for heatwaves and other conditions.
- **Temperature unit conversion**: Easily switch between Celsius and Fahrenheit.

## Technologies Used

- **Frontend**: React.js, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **External API**: OpenWeather API
- **Cron Jobs**: To periodically fetch new weather data
- **Containerization**: Docker for consistent development and deployment

## Project Architecture

1. **Frontend**: A React-based user interface that fetches data from the backend API. It provides options to select cities, days, and display units (Celsius/Fahrenheit).
2. **Backend**: A Node.js/Express.js server that handles API requests. It fetches weather data from an external API and serves it to the frontend.
3. **Database**: PostgreSQL is used to store historical weather data and alerts.
4. **Cron Job**: A scheduled job in the backend runs periodically to fetch and update weather data from the external API and store it in the database.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- Docker (optional, for containerized deployment)

### Steps to Setup the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saivardhan655/second-assignment-zeotap.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the PostgreSQL database**
   - Make sure PostgreSQL is installed and running.
   - Create a database named `weather_db`.
   - Update the `.env` file with your database credentials:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=weather_db
     API_KEY=your_openweather_api_key
     ```

4. **Configure the cron job**
   The cron job is set up in the backend to fetch new weather data from the API every 6 hours. The scheduling is handled using the `node-cron` package in `app.js`. If you want to change the frequency, you can update the cron expression.

5. **Start the backend server**
   ```bash
   npm start
   ```

6. **Start the frontend**
   Navigate to the `frontend` directory and install dependencies:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. **Access the app**
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:8000`

## Docker Setup

You can also run the project using Docker and Docker Compose.

1. **Build and run the services**
   ```bash
   docker-compose up --build
   ```

2. **Services**
   - Backend API: `http://localhost:3000`
   - Frontend UI: `http://localhost:8000`

The `docker-compose.yml` file contains the configuration for the backend, frontend, and PostgreSQL services.

## Usage

Once the app is running, you can:
- Select a city from the sidebar to view its weather data.
- Choose a day (Today, Yesterday, Day Before Yesterday) to see corresponding weather details.
- Switch between Celsius and Fahrenheit units.
- View weather alerts in real-time.
- Observe trends in temperature and conditions over the selected time period.

## API Endpoints

- `GET /api/weather/:city`: Fetch the current weather for the selected city.
- `GET /api/weather/:city/:day`: Fetch weather data for a specific city and day (today, yesterday, etc.).
- `GET /api/alerts/:city`: Fetch weather alerts for the selected city.

## Contributing

If you wish to contribute to this project, feel free to submit pull requests or report issues. Please ensure you follow the coding standards and maintain proper documentation.

---