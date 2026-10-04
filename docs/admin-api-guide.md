# Admin Dashboard — UI Guide for the API

This document describes the new **Afro Nyanka admin dashboard** on the frontend and the data each screen needs, so the API can be designed (or checked) against it.

- **Frontend branch:** `feature/admin-dashboard`
- **Design source:** Figma — *Afro Nyanka Tours Website*, page **Design**, frames `14 · Admin login`, `1 · Dashboard`, `5 · Events`, `Create event`, `Preview`, `6 · Tours`, `Add tour`, `7 · Bookings`, `9 · Settings`
- **Current state:** every screen runs on mock data (`src/data/adminMockData.ts`). Once the endpoints exist, the mock data will be replaced with API calls; the UI itself should not need to change.
- **Source of truth for shapes the UI expects:** `src/types/admin.ts`

> The endpoint paths and payloads below are **suggestions** that follow the existing API conventions (`/api/...`, snake_case JSON, numeric ids, e.g. `GET /api/tours/country/{country}`). If your design differs, that's fine — the important part is that each screen can get the fields listed. Please flag anything that doesn't fit.

---

## 1. Layout and navigation

All admin pages (except Login and Preview) share one shell:

```
┌──────────────┬──────────────────────────────────────────────┐
│ Afro Nyanka  │  Page title                [Search…] [+ New] │
│              ├──────────────────────────────────────────────┤
│ OVERVIEW     │                                              │
│  Dashboard   │   Page content                               │
│ MANAGE       │                                              │
│  Events      │                                              │
│  Tours       │                                              │
│  Bookings    │                                              │
│ SYSTEM       │                                              │
│  Settings    │                                              │
│              │                                              │
│ AB Amara  ⇥  │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

- The bottom of the sidebar shows the **signed-in admin**: name, role, and initials avatar, plus a **sign-out** button.
- Routes: `/admin/login`, `/admin`, `/admin/events`, `/admin/events/new`, `/admin/events/preview`, `/admin/tours`, `/admin/tours/new`, `/admin/tours/:id/edit`, `/admin/bookings`, `/admin/settings`.
- Every admin route except `/admin/login` requires an authenticated admin.

**Needed from the API**

| Need | Suggested endpoint |
|---|---|
| Current admin profile | `GET /api/admin/me` → `{ id, name, role, email }` |
| Sign out | `POST /api/admin/auth/logout` (or just discard the token client-side) |

---

## 2. Admin login — `/admin/login`

Split screen: an orange marketing panel on the left, the sign-in form on the right.

**Fields:** Email address, Password (with show/hide), "Remember me" checkbox.
**Actions:** Sign in. A "Forgot password?" link is present in the UI, but its flow is not designed yet.

| Need | Suggested endpoint |
|---|---|
| Sign in | `POST /api/admin/auth/login` |

```json
// request
{ "email": "amara@afronyanka.com", "password": "••••••", "remember_me": true }

// response 200
{
  "access_token": "…",
  "token_type": "bearer",
  "expires_in": 3600,
  "admin": { "id": 1, "name": "Amara Boateng", "role": "Operations lead", "email": "amara@afronyanka.com" }
}

// response 401
{ "detail": "Invalid email or password" }
```

Questions:
- Token in the response body (stored by the frontend) or an httpOnly cookie? Either works; please confirm.
- Should "Remember me" mean a longer-lived token or a refresh token?
- Forgot-password endpoint — later, or now?

---

## 3. Dashboard — `/admin`

Greeting ("Good morning, Amara"), then:

### 3a. Four stat cards

| Card | Example value | Sub-line |
|---|---|---|
| New inquiries | `3` | `+3 today` |
| Upcoming departures | `4` | `next 14 days` |
| Revenue (30d) | `GHS 142,300` | `+18% vs prev` |
| Avg occupancy | `78%` | `+6% vs last` |

### 3b. "Inquiries to respond to" (list, latest first)

Each row: customer name (initials avatar), tour name, number of guests, and a status chip of **New** or **Replied**. The "View all →" link needs an inquiries list. There is **no Inquiries page designed yet**, so for now it links to Bookings.

### 3c. "Upcoming departures"

Each row: tour name, departure date, `booked / capacity` (e.g. `14 / 16`), and a progress bar. The bar turns green when the departure is full.

### 3d. "Recent activity" feed

Each row: a coloured dot, a message, and a relative time (`2h`, `5h`, `1d`). Examples: *"Fatima Bello replied to your message"*, *"Payment received · SC-2044"*, *"New inquiry from Daniel Osei"*, *"Booking confirmed · SC-2046"*. The orange dot marks a new inquiry; the green dot marks everything else.

**Suggested endpoint:** `GET /api/admin/dashboard`

```json
{
  "stats": {
    "new_inquiries": { "value": 3, "today": 3 },
    "upcoming_departures": { "value": 4, "window_days": 14 },
    "revenue_30d": { "amount": 142300, "currency": "GHS", "change_pct": 18 },
    "avg_occupancy": { "pct": 78, "change_pct": 6 }
  },
  "inquiries": [
    { "id": 11, "customer_name": "Daniel Osei", "tour_name": "Serengeti Migration", "guests": 2, "status": "new", "created_at": "2026-10-04T07:10:00Z" }
  ],
  "upcoming_departures": [
    { "id": 5, "tour_name": "Serengeti Explorer", "departure_date": "2026-10-14", "booked": 14, "capacity": 16 }
  ],
  "recent_activity": [
    { "id": 90, "type": "inquiry_replied", "message": "Fatima Bello replied to your message", "created_at": "2026-10-04T06:00:00Z" }
  ]
}
```

- Inquiry `status`: `new` | `replied`
- Activity `type` (suggested): `inquiry_created` | `inquiry_replied` | `payment_received` | `booking_confirmed` | `booking_cancelled`. The frontend picks the dot colour from this field and formats `created_at` as `2h`, `1d`, and so on.
- Raw numbers are preferred over pre-formatted strings; the frontend handles `GHS 142,300` and `+18% vs prev`.
- Separate endpoints (`/api/admin/inquiries?status=new&limit=4`, etc.) would also work.

---

## 4. Events — `/admin/events`

Card grid. The **top banner** shows draft events, followed by *"N tours live on your landing page · Last synced 2h ago · M drafts not yet published"* and a **Preview site →** button. Below the banner is a grid of **published** events. The top-bar search filters by name or country.

**Event card:** cover image (a striped placeholder when there is none), name, status chip (**Draft** / **Published**), `Country · N days`, and `from GHS 42,000`.

| Need | Suggested endpoint |
|---|---|
| List events | `GET /api/admin/events?status=draft\|published&search=` |
| "Last synced" time | `last_published_at` on the list response (or omit it and the line will be dropped) |

```json
{
  "items": [
    {
      "id": 3,
      "name": "Serengeti Migration Safari",
      "destination": "Serengeti, Tanzania",
      "country": "Tanzania",
      "duration_days": 8,
      "price_from": 42000,
      "currency": "GHS",
      "cover_image_url": "https://…/serengeti.jpg",
      "status": "published"
    }
  ],
  "counts": { "published": 3, "draft": 2 },
  "last_published_at": "2026-10-04T06:12:00Z"
}
```

---

## 5. Create event — `/admin/events/new`

A form on the left, with a Preview card and a Publishing panel on the right.

### Form fields

| Field | Type | Example | Notes |
|---|---|---|---|
| Tour name | text, required | `Serengeti Migration Safari` | |
| Destination | text, required | `Serengeti, Tanzania` | the UI derives the country from the text after the last comma; a separate `country` field would be cleaner |
| Duration | integer ≥ 1 | `8` | days |
| Capacity | integer ≥ 1 | `16` | seats per departure |
| Price per person (GHS) | number | `42000` | |
| First departure | date | `2026-10-16` | also drives the countdown on the landing page |
| Description | text | `An eight-day guided safari…` | |
| **Highlights** | list, max 3 | `[{icon: "users", label: "Guided Experience"}, …]` | icon is one of `users`, `bed`, `bus`; shown on the landing-page card |
| **Activities** | list | `[{name: "Hot-air balloon safari", price: 3500}]` | price empty / `null` = **Free**; travellers pick these when booking |
| Cover image | file (PNG/JPG) | | see *Uploads* below |

### Publishing panel

- **Publish now** — the event goes live immediately.
- **Schedule for later** — requires a "Publish on" date and time (shown as `20 Mar 2026 · 09:00 GMT`).
- Buttons: **Save as draft** and **Publish** (the label becomes **Schedule** when scheduling).

| Need | Suggested endpoint |
|---|---|
| Create event | `POST /api/admin/events` |
| Get one (for edit, later) | `GET /api/admin/events/{id}` |
| Update | `PATCH /api/admin/events/{id}` |
| Delete | `DELETE /api/admin/events/{id}` |

```json
// POST /api/admin/events
{
  "name": "Serengeti Migration Safari",
  "destination": "Serengeti, Tanzania",
  "country": "Tanzania",
  "duration_days": 8,
  "capacity": 16,
  "price": 42000,
  "currency": "GHS",
  "first_departure": "2026-10-16",
  "description": "An eight-day guided safari across the Serengeti plains — full board and expert rangers.",
  "highlights": [
    { "icon": "users", "label": "Guided Experience" },
    { "icon": "bed", "label": "Accommodation Support" },
    { "icon": "bus", "label": "Transport Included" }
  ],
  "activities": [
    { "name": "Great Migration game drive", "price": null },
    { "name": "Hot-air balloon safari", "price": 3500 },
    { "name": "Maasai village visit", "price": 800 }
  ],
  "cover_image_url": "https://…/uploaded.jpg",
  "status": "draft | published | scheduled",
  "publish_at": "2026-10-22T09:00:00Z"
}
```

- `status: "scheduled"` + `publish_at` is needed for *Schedule for later*. The UI has no "Scheduled" chip yet, so please say whether you'll add that status.
- **Validation errors:** return field-level messages so the form can show them, e.g. `{ "detail": [{ "loc": ["body", "name"], "msg": "field required" }] }` (the FastAPI default is fine).

---

## 6. Event preview — `/admin/events/preview`

A full-page preview of how the draft will look in the landing page's **"Upcoming tours"** hero: title, destination, date range (`October 16 - 23, 2026`, calculated from first departure + duration), description, up to 3 highlights, cover image, and a live **countdown** to the first departure.

**No endpoint needed.** The preview renders the unsaved form data. It does mean the **public landing page** will need the same fields (`highlights`, `first_departure`, `duration_days`, `cover_image_url`) from the public tours/events API.

---

## 7. Tours — `/admin/tours`

**Heading:** "Tours on your landing page".

**Filters:** **All (5)**, **Published (3)**, **Drafts (2)**, plus a "Search tours" box.

**Table columns:**

| Column | Example |
|---|---|
| Tour | cover thumbnail, name `Cape Coast Heritage`, `5 activities` |
| Location | `Cape Coast` |
| Duration | `4 days` |
| Price | `GHS 12,000` |
| Status | `Published` / `Draft` |
| Actions | Edit (pencil), Delete (trash, with a confirm prompt) |

| Need | Suggested endpoint |
|---|---|
| List tours | `GET /api/admin/tours?status=&search=` |
| Delete | `DELETE /api/admin/tours/{id}` |

```json
{
  "items": [
    {
      "id": 1,
      "name": "Cape Coast Heritage",
      "location": "Cape Coast",
      "duration_days": 4,
      "price": 12000,
      "currency": "GHS",
      "activities_count": 5,
      "cover_image_url": null,
      "status": "published"
    }
  ],
  "counts": { "all": 5, "published": 3, "draft": 2 }
}
```

- `counts` lets the filter badges show totals without separate requests.
- Pagination isn't designed yet; the UI currently shows everything. `?page=&page_size=` is fine to add — just tell the frontend the response shape.

---

## 8. Add / edit tour — `/admin/tours/new`, `/admin/tours/:id/edit`

Same form as Create event, **minus Highlights**, with a 3-step header: **Tour details → Activities → Publish**. The steps are on a single page and the stepper only scrolls between sections, so this is **one request**, not three.

The right column shows a **live preview of the tour card** as it will appear on the landing page (cover, name, location, `GHS 42,000/Person`, `8 Days`, Book Now), plus the same Publishing panel (**Save as draft** / **Publish tour**).

| Need | Suggested endpoint |
|---|---|
| Create | `POST /api/admin/tours` |
| Load for edit | `GET /api/admin/tours/{id}` |
| Update | `PATCH /api/admin/tours/{id}` |

The payload is the same as the event payload in §5, without `highlights`.

> **Please compare with the existing public `Tour` model** (`GET /api/tours/country/{country}`): it currently has `name, description, country, region, is_active, main_image_url, tour_locations[]`, but no **price, duration, capacity, first departure, activities, or draft/published status**. The admin screens need those. Is the admin tour the same table as the public tour (with extra columns), or something separate? Also, `is_active` vs `status: draft|published` — which one wins?

---

## 9. Bookings — `/admin/bookings`

**Filters:** **All**, **Paid**, **Pending**, **Confirmed**, **Cancelled**; the top-bar search matches reference, customer or tour.

**Table columns:**

| Column | Example |
|---|---|
| Reference | `SC-2048` |
| Customer | initials avatar + `Daniel Osei` |
| Tour | `Serengeti Migration Safari` |
| Departure | `Mar 14` |
| Amount | `GHS 84,000` |
| Status | `Pending` / `Paid` / `Confirmed` / `Cancelled` |

| Need | Suggested endpoint |
|---|---|
| List bookings | `GET /api/admin/bookings?status=&search=&page=` |

```json
{
  "items": [
    {
      "id": 2048,
      "reference": "SC-2048",
      "customer_name": "Daniel Osei",
      "customer_email": "daniel@example.com",
      "tour_id": 3,
      "tour_name": "Serengeti Migration Safari",
      "departure_date": "2026-10-14",
      "guests": 2,
      "amount": 84000,
      "currency": "GHS",
      "status": "pending"
    }
  ],
  "total": 5
}
```

- Booking `status`: `pending` | `paid` | `confirmed` | `cancelled`. Please confirm the lifecycle: is "paid" before "confirmed", or are they independent (payment status vs booking status)?
- The public site already posts to `POST /api/bookings/`. Those bookings should be what this list shows.
- Not designed yet: a booking detail view and actions such as confirm, cancel or refund. Expect `GET/PATCH /api/admin/bookings/{id}` later.

---

## 10. Settings — `/admin/settings`

### Company profile (shown on the public site)

| Field | Example |
|---|---|
| Brand logo | image, with a "Change logo" upload |
| Company name | `Afro Nyanka Tours` |
| Contact email | `info@afronyanka.com` |
| Phone | `+233 24 123 4567` |
| Location | `Accra, Ghana` |

Saved with the **Save changes** button.

### Notification preferences (each toggle saves immediately)

| Key | Label | Default |
|---|---|---|
| `inquiry_alerts` | New inquiry alerts — *Email me when a traveller sends an inquiry* | on |
| `booking_confirmations` | Booking confirmations — *Notify me when a booking is paid or confirmed* | on |
| `weekly_summary` | Weekly summary email — *A Monday digest of the week ahead* | off |

| Need | Suggested endpoint |
|---|---|
| Get company profile | `GET /api/admin/settings/company` |
| Update company profile | `PUT /api/admin/settings/company` |
| Get notification prefs | `GET /api/admin/settings/notifications` |
| Update one pref | `PATCH /api/admin/settings/notifications` → `{ "weekly_summary": true }` |

Are notification prefs **per admin user** or **company-wide**? The UI says "Email me", which suggests per user.

---

## 11. Cross-cutting

### Uploads (event/tour cover image, brand logo)
The UI accepts PNG/JPG and currently shows a local preview. Two options; please pick one:
1. `POST /api/admin/uploads` (multipart) → `{ "url": "https://…" }`, then send `cover_image_url` in the create/update request; **or**
2. Send the file as multipart directly on `POST/PATCH /api/admin/tours` and `/events`.

Please state the max file size and whether you resize or generate thumbnails. The tours table shows a 52×40 thumbnail and the cards show 360×140.

### Money
- Every admin screen shows **GHS**. Please return numbers plus a `currency` field; the frontend formats `GHS 12,000`.
- The landing-page card design shows `$600.00/Person`. Is the public site priced in USD while the admin uses GHS? This needs a decision.

### Dates & times
- Dates as `YYYY-MM-DD`; timestamps in ISO-8601 UTC. The UI labels publish times as GMT (same as Ghana local time).

### Auth & errors
- `Authorization: Bearer <token>` on all `/api/admin/*` routes (or a cookie, see §2).
- `401` → the frontend sends the user back to `/admin/login`.
- `403` → not an admin.
- `422` → field validation errors (FastAPI style is fine).

### Enums used by the UI

| Name | Values |
|---|---|
| Publish status | `draft`, `published` (+ `scheduled`?) |
| Booking status | `pending`, `paid`, `confirmed`, `cancelled` |
| Inquiry status | `new`, `replied` |
| Highlight icon | `users`, `bed`, `bus` |

---

## 12. Open questions for the backend

1. **Events vs Tours:** are these two separate resources, or one resource with a type/flag? The UI treats them separately; an event has highlights and a featured countdown on the landing page.
2. How does the admin tour relate to the existing public `Tour` model (see §8)?
3. Is `scheduled` a real status, and does the backend publish automatically at `publish_at`?
4. Booking status lifecycle (see §9).
5. Do **inquiries** come from the contact form (`POST /api/contact/`) or somewhere else? Their `new`/`replied` status needs to be stored somewhere.
6. Currency: GHS vs USD on the public site.
7. Token vs cookie auth; forgot-password flow.
8. Upload strategy and limits.
