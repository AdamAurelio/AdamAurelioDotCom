# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app

# Install production deps first for better layer caching. `npm ci` needs the
# committed package-lock.json and gives a reproducible install (matches the web
# tier and CI).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "server.js"]
