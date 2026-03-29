.PHONY: check test test-e2e typecheck lint format fix all dev build clean

# Full validation: check + test
all: check test

# Static analysis: typecheck + lint/format
check: typecheck lint

# TypeScript type checking
typecheck:
	@echo "→ TypeCheck..." && npx tsc --noEmit && echo "  ✓ TypeCheck passed"

# Lint and format check (Biome)
lint:
	@echo "→ Lint & Format..." && npx biome check . && echo "  ✓ Lint & Format passed"

# Auto-fix lint and format issues
fix:
	npx biome check --write .

format:
	npx biome format --write .

# Unit tests (Vitest)
test:
	@echo "→ Unit Tests..." && npx vitest run && echo "  ✓ Unit Tests passed"

# E2E tests (Playwright — requires dev server running)
test-e2e:
	@echo "→ E2E Tests..." && npx playwright test && echo "  ✓ E2E Tests passed"

# Dev server
dev:
	npm run dev

# Production build
build:
	npm run build

# Database migrations
db-generate:
	npx drizzle-kit generate --config drizzle.config.ts

db-migrate:
	npx drizzle-kit migrate --config drizzle.config.ts

db-push:
	npx drizzle-kit push --config drizzle.config.ts

# Clean build artifacts
clean:
	rm -rf .next dist node_modules/.cache
