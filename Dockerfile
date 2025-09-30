# استفاده از node:20 به جای alpine
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies با --legacy-peer-deps برای حل مشکل dependency
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Environment variable to ignore TypeScript errors
ENV NEXT_TYPESCRIPT_IGNORE_BUILD_ERRORS=true

# Build the Next.js application
RUN npm run build

# نصب serve برای اجرای static files
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the application با serve برای static export
CMD ["serve", "-s", "out", "-l", "3000"]