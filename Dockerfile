# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Build your Next.js app
RUN npm run build

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
