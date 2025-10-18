FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dependencies
RUN npm ci --only=production

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package*.json ./

RUN mkdir -p logs public/uploads/cars && \
    chown -R nodejs:nodejs logs public

USER nodejs

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/infrastructure/web/express/server.js"]
