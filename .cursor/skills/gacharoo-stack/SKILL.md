---
name: gacharoo-stack
description: Gacharoo tech stack patterns for Bun, Biome, Drizzle ORM, better-auth, Next.js 15 App Router, Zustand, and next-intl. Use when setting up infrastructure, writing database queries, configuring auth, managing state, or adding translations.
---

# Gacharoo Stack Patterns

## Bun

Bun is the ONLY runtime and package manager. Never use `npm`, `npx`, `pnpm`, or `node` commands.

```bash
bun install            # Install dependencies
bun run dev            # Start dev server
bun run build          # Production build
bun run lint           # Biome lint check
bun run format         # Biome format
bun test               # Run tests
bun run db:generate    # Generate Drizzle migrations
bun run db:push        # Push schema to DB
bun run db:studio      # Open Drizzle Studio
```

`bunfig.toml` for project config. `bun.lockb` for lockfile (binary, commit it).

## Biome

Single config file `biome.json`. Replaces ESLint + Prettier.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
  "organizeImports": { "enabled": true },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedImports": "error", "noUnusedVariables": "warn" },
      "suspicious": { "noExplicitAny": "warn" },
      "style": { "noNonNullAssertion": "warn" }
    }
  },
  "javascript": {
    "formatter": { "quoteStyle": "double", "semicolons": "asNeeded" }
  },
  "files": { "ignore": [".next/", "node_modules/", "data/"] }
}
```

Run `bun run lint` before committing. Biome auto-fixes most issues with `--write`.

## Drizzle ORM

### Schema Definition

Schemas live in `/src/lib/db/schema/`. One file per domain (e.g., `cards.ts`, `users.ts`, `battles.ts`).

```typescript
import { pgTable, uuid, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core"

export const cardSets = pgTable("card_sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  isPublic: boolean("is_public").default(false),
  isNsfw: boolean("is_nsfw").default(false),
  rarityWeights: jsonb("rarity_weights").$type<RarityWeights>(),
  packSize: integer("pack_size").default(5),
  packCap: integer("pack_cap"),
  createdAt: timestamp("created_at").defaultNow(),
})
```

### Query Patterns

```typescript
import { db } from "@/lib/db/client"
import { cardTemplates } from "@/lib/db/schema/cards"
import { eq, and } from "drizzle-orm"

// Simple query
const cards = await db.select().from(cardTemplates).where(eq(cardTemplates.setId, setId))

// With relations (use Drizzle's relational query API)
const setWithCards = await db.query.cardSets.findFirst({
  where: eq(cardSets.id, setId),
  with: { cards: true, members: true },
})
```

### Migrations

```bash
bun run db:generate    # drizzle-kit generate (creates SQL from schema diff)
bun run db:push        # drizzle-kit push (apply to dev DB directly)
bun run db:migrate     # drizzle-kit migrate (run generated migrations in production)
```

Never edit generated migration SQL files. Change the schema TypeScript, regenerate.

### Client Setup

```typescript
// src/lib/db/client.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connection = postgres(process.env.DATABASE_URL!)
export const db = drizzle(connection, { schema })
```

## better-auth

### Server Setup

```typescript
// src/lib/auth/index.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/lib/db/client"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [nextCookies()],
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})
```

### API Route

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

### Server Components (reading session)

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  return <div>Hello {session.user.name}</div>
}
```

### Client Components (auth actions)

```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
})

// In a component:
const { data: session } = authClient.useSession()
await authClient.signIn.email({ email, password })
await authClient.signUp.email({ email, password, name })
```

### Middleware (route protection)

```typescript
// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token")
  if (!sessionCookie && request.nextUrl.pathname.startsWith("/(game)")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ["/(game)/:path*"] }
```

## Zustand

One store per concern. Use selectors to prevent unnecessary re-renders.

```typescript
// src/stores/pack-store.ts
import { create } from "zustand"

interface PackState {
  packsOpenedToday: number
  sessionStart: number | null
  incrementPacksOpened: () => void
  startSession: () => void
}

export const usePackStore = create<PackState>((set) => ({
  packsOpenedToday: 0,
  sessionStart: null,
  incrementPacksOpened: () => set((s) => ({ packsOpenedToday: s.packsOpenedToday + 1 })),
  startSession: () => set({ sessionStart: Date.now() }),
}))

// In components -- ALWAYS use selectors:
const count = usePackStore((s) => s.packsOpenedToday)  // GOOD
const store = usePackStore()  // BAD - re-renders on ANY change
```

For Three.js animations, use `getState()` outside React:

```typescript
useFrame(() => {
  const { packsOpenedToday } = usePackStore.getState()
})
```

## next-intl

### Setup

```typescript
// src/i18n/config.ts
export const locales = ["en", "de"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"
```

### Usage in Components

```tsx
import { useTranslations } from "next-intl"

export function PackCounter() {
  const t = useTranslations("packs")
  return <p>{t("openedToday", { count: 5 })}</p>
}
```

### Translation Files

```json
// src/messages/en.json
{
  "packs": {
    "openedToday": "Packs opened today: {count}",
    "empty": "Out of packs! Next pack in {time}.",
    "adPrompt": "Watch a short ad to get an extra pack."
  }
}
```

Never hardcode user-facing strings. Always use translation keys.

## Server-Sent Events (Real-time)

For trade notifications and battle results, use SSE from API routes:

```typescript
// src/app/api/events/route.ts
export async function GET(request: Request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }
      // Subscribe to events for this user
      // send({ type: "trade_offer", ... })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
```

Client-side: use `EventSource` API to listen.

## Docker (Development)

```bash
docker compose -f docker-compose.dev.yml up  # Start PostgreSQL + Umami with hot-reload Next.js
bun run dev                                   # Next.js dev server (runs outside Docker for hot-reload speed)
```

Production uses `docker compose up` with all 4 containers (PostgreSQL, Next.js standalone, Umami, Caddy).
