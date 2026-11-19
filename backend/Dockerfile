FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies first so this layer is cached
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

USER node
EXPOSE 3000

# MONGO_URI and JWT_SECRET must be provided at run time, e.g.
#   docker run -p 3000:3000 -e MONGO_URI=... -e JWT_SECRET=... image
CMD ["node", "src/server.js"]
