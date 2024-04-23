# Stoke Portfolio

This project is a Stock Portfolio developed using Node.js + Express.js for the backend.

## Features

- Retrieve the portfolio
- Add/delete/modify trades
- Get the average buying price, cumulative return
- Calculate the average buying price as the average of all buys disregarding sells.
- The cumulative return requires the initial and final price. The initial price should be on the trade, assume the final price to be 100 for simplicity.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/harshm29/stock-portfolio.git
   ```

2. **Setup:**

   - Navigate to the `stock-portfolio` folder.
   - Install dependencies: `npm install -f`
   - Set up environment variables in a `.env` file.

   Example `.env` configurations:

   ```dotenv
   HOST="http://localhost:1500/"
   FRONTENDURL="http://localhost:4000/"
   PORT="1500"
   DB="mongodb://0.0.0.0:27017/stock-portfolio"
   ROOTAPI="api/"
   MASTERKEY="SPO"
   FRONTEND="http://localhost:4000/"
   KEY="polling-sjrfvdht"
   EMAIL_FROM="harshmakavana04@gmail.com"
   EMAIL_PWD="cfck kqzw sjuq mcne"
   ```

3. **Run the Application:**

   - Start the backend server: `npm start` in the `stock-portfolio` folder.

4. **Access the Application:**

   - Open your browser and go to `http://localhost:1500` to access the Stock API's.

   - Swagger documentation UI: `http://localhost:1500/api-docs`

## Technologies Used

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB
