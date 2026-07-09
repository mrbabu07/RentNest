# RentNest 🏠

A backend API for a rental property marketplace where landlords list properties, tenants submit rental requests and make payments, and admins moderate the platform.

## Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Prisma
- **Auth:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Password Hashing:** bcryptjs

## Project Structure

```
rentnest/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script (admin + categories)
├── src/
│   ├── config/
│   │   └── db.ts            # Prisma client instance
│   ├── middlewares/
│   │   ├── auth.middleware.ts       # JWT auth + role guard
│   │   ├── error.middleware.ts      # Global error handler
│   │   └── validate.middleware.ts   # Zod request validation
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   └── catchAsync.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── properties/
│   │   ├── rentals/
│   │   ├── payments/
│   │   ├── reviews/
│   │   └── admin/
│   ├── app.ts                # Express app setup
│   └── server.ts             # Entry point
├── .env
└── tsconfig.json
```

## Roles & Permissions

| Role | Key Permissions |
|---|---|
| **Tenant** | Browse listings, submit rental requests, make payments, leave reviews |
| **Landlord** | Create/manage listings, approve/reject rental requests |
| **Admin** | Manage users (ban/unban), manage categories, view platform-wide data |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env` and fill in your values:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### 3. Run database migrations
```bash
npx prisma migrate dev --name init
```

### 4. Seed the database (creates admin + categories)
```bash
npx prisma db seed
```
Default admin credentials: `admin@rentnest.com` / `Admin@123`

### 5. Start the dev server
```bash
npm run dev
```
Server runs on `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Categories
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/categories` | Public |
| POST | `/api/categories` | Admin |
| DELETE | `/api/categories/:id` | Admin |

### Properties
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/properties` | Public (supports `?location=&minPrice=&maxPrice=&categoryId=&bedrooms=`) |
| GET | `/api/properties/:id` | Public |
| GET | `/api/properties/my-properties` | Landlord |
| POST | `/api/properties` | Landlord |
| PUT | `/api/properties/:id` | Landlord (owner only) |
| DELETE | `/api/properties/:id` | Landlord (owner only) |

### Rental Requests
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/rentals` | Tenant |
| GET | `/api/rentals/my-requests` | Tenant |
| GET | `/api/rentals/landlord-requests` | Landlord |
| GET | `/api/rentals/:id` | Authenticated (involved parties) |
| PATCH | `/api/rentals/:id` | Landlord (owner only) — approve/reject |

### Payments
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/payments` | Tenant |
| GET | `/api/payments` | Tenant |
| GET | `/api/payments/:id` | Authenticated (involved parties) |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews` | Tenant (must have rented the property) |
| GET | `/api/reviews/property/:propertyId` | Public |
| DELETE | `/api/reviews/:id` | Tenant (owner only) |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id` | Admin — ban/unban |
| GET | `/api/admin/properties` | Admin |
| GET | `/api/admin/rentals` | Admin |

## Key Business Rules

- A landlord cannot submit a rental request for their own property.
- A tenant cannot submit a duplicate pending request for the same property.
- When a rental request is approved, the property status changes to `RENTED`.
- Payment can only be made for an `APPROVED` rental request, and only once.
- Successful payment moves the rental request status to `ACTIVE`.
- A review can only be submitted by a tenant with an `ACTIVE` or `COMPLETED` rental history for that property.
- Only property owners (landlords) can update/delete their own properties.
- Admin accounts cannot be banned via the API.

## Data Flow (Rental Lifecycle)

```
PENDING → (landlord approves) → APPROVED → (tenant pays) → ACTIVE → COMPLETED
                ↓
          (landlord rejects) → REJECTED
```

## Author
Built by **mrbabu07** — Programming Hero Level-2, Batch 12