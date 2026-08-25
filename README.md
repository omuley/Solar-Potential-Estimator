# Solar-Potential-Estimator ☀️

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Description

This project is a web application that estimates the solar energy potential for a given location. It leverages Google's Project Sunroof API to gather solar irradiation data and combines it with user-provided electricity bill and usage information to provide a detailed analysis of potential solar energy generation, cost savings, return on investment (ROI), and net profit over time. The application features an interactive map, various financial projection charts, and a user-friendly interface for inputting location and energy consumption data.

## Table of Contents 📚

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Important Links](#important-links)
- [Footer](#footer)

## Features ✨

- **Accurate Solar Potential Estimation:** Utilizes Google's Project Sunroof API to get detailed solar irradiation data for specific locations.
- **Financial Projections:** Calculates estimated installation costs, annual savings, payback period, 25-year ROI, and net profit.
- **Interactive Map Integration:** Displays the location with a marker and an optional overlay of solar data.
- **Dynamic Charting:** Visualizes yearly energy production, annual savings, net profit, and ROI using Recharts.
- **Address Autocomplete:** Integrates with Google Maps Places API for easy and accurate address input.
- **Data Caching:** Stores previous calculations in a database (Prisma with PostgreSQL) to speed up repeat requests.
- **Image Rendering:** Generates and stores a visual representation of solar data (likely a heatmap or similar) in AWS S3.
- **Responsive Design:** Adaptable UI for different screen sizes.

## Tech Stack 🛠️

- **Frontend:**
  - React
  - Vite
  - React Leaflet
  - Recharts
  - Tailwind CSS
  - TypeScript (for server-side configurations like Prisma)

- **Backend:**
  - Node.js
  - Express.js
  - Prisma (ORM for database interaction)
  - AWS SDK (for S3 storage)
  - Google Maps Platform APIs (Places API, Solar API)
  - `geotiff`, `pngjs`, `proj4` (for geospatial data processing)

- **Development & Build:**
  - Vite
  - ESLint
  - Vitest (for testing)

## Installation ⚙️

**Prerequisites:**

- Node.js (v18 or higher recommended)
- npm or yarn
- A Google Cloud Platform account with the Places API and Solar API enabled.
- AWS account with S3 configured for storing images.

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/omuley/Solar-Potential-Estimator.git
    cd Solar-Potential-Estimator
    ```

2.  **Install Client Dependencies:**
    Navigate to the client directory and install dependencies:
    ```bash
    cd client
    npm install
    ```
    *   Create a `.env` file in the `client` directory based on `.env.example` and add your `VITE_GOOGLE_MAPS_KEY`.

3.  **Install Server Dependencies:**
    Navigate to the server directory and install dependencies:
    ```bash
    cd ../server
    npm install
    ```
    *   Set up your `.env` file in the `server` directory with the necessary environment variables:
        ```dotenv
        GOOGLE_API_KEY=your-google-api-key
        AWS_REGION=your-aws-region
        AWS_ACCESS_KEY_ID=your-aws-access-key-id
        AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
        S3_BUCKET_NAME=your-s3-bucket-name
        DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
        ```
    *   Configure your database connection string in `DATABASE_URL`.
    *   Run Prisma migrations:
        ```bash
        npx prisma migrate dev --name init
        ```

4.  **Start the Development Server:**
    *   **Client:** In the `client` directory:
        ```bash
        npm run dev
        ```
    *   **Server:** In the `server` directory:
        ```bash
        npm run dev
        ```

    The application should be accessible at `http://localhost:5173` (or your Vite default port) with the backend running on `http://localhost:3000`.

## Usage 🚀

This application is designed to help homeowners and solar energy enthusiasts estimate the solar potential of a property and understand the financial implications of installing solar panels.

**Use Cases:**

- **Homeowners:** Get a quick estimate of how much solar energy your roof can generate, potential savings, and the return on investment.
- **Solar Installers:** Use the tool for initial consultations to provide clients with data-driven estimates.
- **Researchers:** Analyze solar potential across different locations.

## How to Use 💡

1.  **Enter Address:** On the main page, you'll see an address search bar. Start typing an address, and the Google Places API will provide suggestions. Select the correct address.
2.  **Provide Energy Bill Details:** Input your average monthly electricity bill (in USD) and your average monthly energy usage (in kWh).
3.  **Get Estimate:** Click the "Get Solar Data" button.
4.  **View Results:** After a brief processing time, you'll be redirected to the results page.
    -   **Map View:** See your location on a map, with a marker indicating the property and an optional overlay of solar data.
    -   **Analysis Charts:** Explore detailed financial projections and energy production data through interactive charts:
        -   **ROI Chart:** Shows cumulative savings and payback period.
        -   **Net Profit Chart:** Tracks the cumulative profit over 25 years.
        -   **Annual Savings Chart:** Visualizes yearly savings.
        -   **Energy Use Chart:** Displays estimated solar production vs. actual energy usage.

## Project Structure 📁

```
Solar-Potential-Estimator/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── AddressSearch.jsx
│   │   │   ├── BackgroundMap.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── InputForm.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── index.jsx
│   │   └── leaflet-config.js
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── prisma.js
│   ├── routes/
│   │   └── estimate.js
│   ├── services/
│   │   ├── cacheService.js
│   │   ├── financialCalculator.js
│   │   ├── optimizer.js
│   │   ├── rasterRender.js
│   │   ├── rasterStorage.js
│   │   └── solarService.js
│   ├── .env.example
│   ├── .eslintrc.cjs
│   ├── package.json
│   ├── prisma.config.ts
│   ├── server.js
│   └── testGeocode.js
├── package.json
└── README.md
```

## API Reference 🌐

### `POST /api/fetchSolarEstimate`

**Description:** Fetches a solar potential estimate for a given location and energy consumption details.

**Request Body:**

```json
{
  "address": "string",
  "lat": "number",
  "lng": "number",
  "monthlyElectricityBill": "number",
  "monthlyEnergyUsageKwh": "number"
}
```

**Response Body (Success):**

```json
{
  "lat": "number",
  "lng": "number",
  "panelCount": "number",
  "annualProduction": "number",
  "installCost": "number",
  "annualSavings": "number",
  "paybackYears": "number",
  "ROI": "number",
  "NetProfit": "number",
  "yearlyProjection": [
    {
      "year": "number",
      "production": "number",
      "electricityRate": "number",
      "yearlySavings": "number",
      "cumulativeSavings": "number",
      "cumulativeProfit": "number"
    }
    // ... more years
  ],
  "imageUrl": "string",
  "imageBounds": [
    ["number", "number"], // [south_lat, west_lng]
    ["number", "number"]  // [north_lat, east_lng]
  ]
}
```

**Response Body (Error):**

```json
{
  "error": "string"
}
```

## Contributing 📝

Contributions are welcome! Please feel free to:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/AmazingFeature`).
3.  Make your changes and commit them (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code follows the existing style and includes tests where appropriate.

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Important Links 🔗

-   **Live Demo:** IN PROGRESS
-   **Google Project Sunroof API:** [https://developers.google.com/maps/documentation/solar/overview](https://developers.google.com/maps/documentation/solar/overview)
-   **Google Maps Platform:** [https://cloud.google.com/maps-platform](https://cloud.google.com/maps-platform)

## Footer 🏡

This project was developed by [omuley](https://github.com/omuley) and [sliu247](https://github.com/sliu247).

--- 

**Star this repository ⭐ | Fork it 🍴 | Report Issues 🐞 | Suggest Features 💡**

_© 2023 Solar-Potential-Estimator. All rights reserved._


---
**<p align="center">Generated by [ReadmeCodeGen](https://www.readmecodegen.com/)</p>**
