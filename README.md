
# EV Clean Energy Project - S24

This is a full-stack application with an Angular frontend and Node.js backend for managing clean energy and electric vehicle data.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Project Structure

```
./
├── ev-cleanenergy-frontend/  # Angular frontend application
└── ev-cleanenergy-backend/   # Node.js backend server
```

## Setup & Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd ev-cleanenergy-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

The backend server will start running on http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ev-cleanenergy-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

The frontend application will be available at http://localhost:4200

## Development

- Frontend changes can be made in the `ev-cleanenergy-frontend/src` directory
- Backend changes can be made in the `ev-cleanenergy-backend` directory
- The application will automatically reload when you make changes

## Building for Production

### Frontend
```bash
cd ev-cleanenergy-frontend
ng build --prod
```

The built files will be available in `ev-cleanenergy-frontend/dist`

### Backend
```bash
cd ev-cleanenergy-backend
npm run build
```

## Live Project Link
http://ev-energy.s3-website.us-east-2.amazonaws.com/

