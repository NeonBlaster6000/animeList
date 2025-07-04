# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose dev server port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev"]
