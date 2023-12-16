# Use the official Node.js 16 image as the base image
FROM node:18 AS build

WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN yarn build

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM node:18-alpine AS production

WORKDIR /app

# Copy the production build from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose the port on which your NestJS app is listening
EXPOSE 8000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main.js"]
