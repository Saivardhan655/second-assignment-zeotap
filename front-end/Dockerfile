# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app's source code into the container
COPY . .

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app with Serve
CMD ["serve", "-s", "build", "-l", "5000"]
