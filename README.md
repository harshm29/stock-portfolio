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
   DB="DBURI"
   ROOTAPI="api/"
   MASTERKEY="yx"
   FRONTEND="http://localhost:4000/"
   KEY="xyz"
   EMAIL_FROM="xyz@gmail.com"
   EMAIL_PWD="xy"
   ```

3. **Run the Application:**

   - Start the backend server: `npm start` in the `stock-portfolio` folder.

4. **Access the Application:**

   - Open your browser and go to `http://localhost:1500` to access the Stock API's.

   - Swagger documentation UI: `http://localhost:1500/api-docs`

   - POSTMAN URL:`https://dark-rocket-239741.postman.co/workspace/New-Team-Workspace~3c2e08ea-0eff-4948-9885-8e3324ea9c90/collection/2037382-70f3bb0a-81e0-4074-b7b1-ac2887b02450?action=share&creator=2037382&active-environment=2037382-8820f9b9-99fd-4f2d-84c6-a13066d1e2f4`

## Technologies Used

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB
