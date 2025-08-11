# Build stage
FROM node:22-bullseye AS build

WORKDIR /app

COPY package.json  ./

# Install dependencies using npm (already included in Node.js image)
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build 

# Runtime stage - using lightweight Alpine image
FROM nginx:1.29-alpine


COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions for nginx directories
RUN chown -R nginx:nginx /usr/share/nginx/html

RUN mkdir -p /var/run/nginx && \
    chown -R nginx:nginx /var/run/nginx


EXPOSE 7000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]