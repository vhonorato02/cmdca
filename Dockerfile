# The production build is generated and verified by GitHub Actions only;
# the VPS just pulls this image (no compilation on the server).
FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    ENFORCE_PRODUCTION_ENV=true \
    MEDIA_DIR=/app/media
COPY --chown=node:node .next/standalone ./
COPY --chown=node:node .next/static ./.next/static
COPY --chown=node:node public ./public
# Uploaded media lives on a persistent volume mounted here (uid 1000 = node).
RUN mkdir -p /app/media && chown node:node /app/media
# The build prerenders pages against an empty CI database. Next takes an ISR entry's
# age from the file mtime, so dating these files to 2000 makes them expired: the first
# request after each deploy renders from the real database (blocking) instead of
# serving the empty build HTML for the whole revalidate window.
RUN find .next/server/app -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.meta' -o -name '*.body' \) \
      -exec touch -d '2000-01-01T00:00:00Z' {} +
USER node
EXPOSE 3000
VOLUME ["/app/media"]
HEALTHCHECK --interval=30s --timeout=15s --start-period=90s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health',{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
