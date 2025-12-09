FROM node:20-bullseye-slim

# Use Debian-based image so native binaries (Prisma, esbuild) work reliably.
RUN apt-get update && apt-get install -y --no-install-recommends \
		ca-certificates \
		libssl1.1 \
		openssl \
	&& rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Install dependencies (copy package.json first for Docker cache)
COPY package.json package-lock.json* ./
RUN npm install --silent || npm install --legacy-peer-deps --silent

# Copy source code
COPY . .

# Generate Prisma client for Debian target (ensures the debian-openssl-1.1.x
# query engine is generated inside the image so the runtime can load it).
RUN npx prisma generate --schema=prisma/schema.prisma --binary-targets native,debian-openssl-1.1.x || true

# Expose next dev port
EXPOSE 4000

# Default command (overridden by docker-compose for worker)
CMD ["npm", "run", "dev"]
