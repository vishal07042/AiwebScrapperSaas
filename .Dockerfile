# Use Playwright’s base image with all browser dependencies
FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /backend

# Copy package files and install dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY backend/ .

# Install Playwright browsers with dependencies
RUN npx playwright install --with-deps

# Expose port your app will run on
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
