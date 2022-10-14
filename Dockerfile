FROM node:lts-alpine as build-stage

# working Dir
WORKDIR /app

# Copy Package Json Files
COPY package*.json ./

# Install Files
RUN npm install

# Copy Source Files
COPY . .

# Build
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]