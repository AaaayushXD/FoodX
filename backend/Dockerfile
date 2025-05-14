FROM node:24-alpine3.20 AS builder

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm ci 

COPY . .

RUN npm run build:ts

RUN npm ci --omit=dev --no-audit --no-fund --prefer-offline && \
    # Remove any extraneous packages
    npm prune --production && \
    # Remove development files within packages
    find node_modules -type d -name "test" -o -name "tests" -o -name ".github" | xargs rm -rf && \
    find node_modules -type f -name "*.ts" -o -name "*.map" -o -name "CHANGELOG.md" -o -name ".npmignore" -o -name ".gitignore" | xargs rm -f


FROM node:24-alpine3.20 AS runner

WORKDIR /app

ENV NODE_ENV=production


COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/package-lock.json ./package-lock.json
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/public ./public


RUN mkdir -p /app/uploads /app/logs && \
    # Clean up npm cache and other unnecessary files
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/* && \
    # Set permissions
    chown -R node:node /app && \
    chmod 755 /app/uploads /app/logs

USER node


CMD ["npm", "start"]