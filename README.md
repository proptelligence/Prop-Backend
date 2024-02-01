# Proptelliegence User Authentication

This repository contains the backend code for user authentication using Express, SQLite, bcrypt, and CORS.

## Getting Started

These instructions will help you set up and run the server on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/proptelliegence/authentication-backend.git

2. Install dependencies

     ```bash
       npm install
       npm install express -save
       npm install bcrypt
       Database Setup
       npm install sqlite3

     
### Running the Server

      Start the server: 
        
                ```bash node app.js

       The server will be running at http://localhost:3002.



### User Registration
       
       Endpoint: POST /register

To register a new user, send a POST request with JSON payload:

json
```bash {
  "name": "John Doe",
  "mobile": "1234567890",
  "email": "john@example.com",
  "password": "your_password"
}


### User Login
Endpoint: POST /login

To log in, send a POST request with JSON payload:

json

```bash
      {
        "username": "john@example.com",
        "password": "your_password"
      }

Get User Data
Endpoint: GET /users

To retrieve all user data, send a GET request to /users.

Contributing
Feel free to contribute by opening issues or pull requests.

License
This project is licensed under the MIT License - see the LICENSE file for details.

