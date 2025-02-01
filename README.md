
# SmartPath: Educational Platform API

## Overview

SmartPath is a backend API for an educational platform that allows users to manage educational courses and quizzes. This REST API service provides CRUD operations for courses and quizzes linked to those courses.

## Problem Statement

The API offers the following functionalities:
- CRUD operations for courses
- CRUD operations for quizzes linked to courses
- Utilizes a MongoDB database

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/rkchaos/smartpath.git
   ```

2. Set up the following environment variables in a `.env` file:
   - MONGOURL
   - ACCESS_TOKEN_SECRET
   - ACCESS_TOKEN_EXPIRY
   - REFRESH_TOKEN_SECRET
   - REFRESH_TOKEN_EXPIRY

3. Install dependencies:
   ```
   npm i
   ```

4. Start the server:
   ```
   npm start
   ```

## API Documentation

Access the Swagger documentation at:
```
<your_port_number>/api-docs
```

## Authentication

All routes are authenticated. Users must log in before accessing the API endpoints.

## Backend Stack

- Node.js/Express.js for the backend
- MongoDB as the database
- Postman for API testing
