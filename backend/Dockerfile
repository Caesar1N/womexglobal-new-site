# Use an official Node.js runtime as a parent image.
# We choose a specific version for consistency.
FROM node:18-alpine

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory.
# The 'COPY' command copies files from your local machine into the container.
COPY package*.json ./

# Install the project dependencies inside the container.
RUN npm install

# Copy the rest of your backend source code into the container.
COPY . .

# Expose the port the app runs on.
EXPOSE 5001

# Define the command to run your app when the container starts.
CMD [ "node", "server.js" ]