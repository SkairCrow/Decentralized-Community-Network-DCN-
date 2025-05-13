#!/bin/bash

# This script is used to start the Supabase local development environment and the frontend.

# Navigate to the backend directory and start Supabase
cd ./backend || { echo "Backend directory not found!"; exit 1; }
supabase start --ignore-health-check || { echo "Failed to start Supabase!"; exit 1; }

# Navigate to the frontend directory and start the development server
cd ../frontend/cms_app || { echo "Frontend directory not found!"; exit 1; }
npm run dev || { echo "Failed to start the frontend development server!"; exit 1; }