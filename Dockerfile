# Dockerfile.backend
# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN apk add --no-cache postgresql-client
# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
