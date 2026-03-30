# 1. Use an official Node.js runtime as a parent image
FROM node:20-alpine

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your frontend code
COPY . .

# 6. Expose the port Vite runs on
EXPOSE 5173

# 7. Start the app with the --host flag 
# (This is CRITICAL for Vite to work inside Docker)
CMD ["npm", "run", "dev", "--", "--host"]