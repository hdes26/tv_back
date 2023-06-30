###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the project source code to the container
COPY . .

# Run the build script
RUN npm run build

# Use the node user from the image (instead of the root user)
USER node

# Command to start the application
CMD [ "node", "dist/src/main.js" ]