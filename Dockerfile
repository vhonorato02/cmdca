# The production build is generated and verified by GitHub Actions only.
FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    ENFORCE_PRODUCTION_ENV=true
COPY --chown=node:node .next/standalone ./
COPY --chown=node:node .next/static ./.next/static
COPY --chown=node:node public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health',{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
