# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Expose no ports (stdio-based MCP server)
# ENV variables for Harbor config
ENV HARBOR_API_BASE=""
ENV HARBOR_AUTH_USER=""
ENV HARBOR_AUTH_PASS=""

# Default command
CMD ["node", "build/index.js"]
