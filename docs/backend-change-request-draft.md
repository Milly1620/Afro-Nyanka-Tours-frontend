# Backend feedback after frontend integration

_Draft, 15 Nov 2026. Tested end to end against the live API with the admin account: login, extras, tours, events, bookings, status changes, settings, uploads and scheduling._

## Summary

**No backend change is required for the admin flows.** Every flow in the handoff works as documented, and the frontend is already adapted to the differences below. The one new request is the testimonials endpoint in section 0. The items are ordered by how much they would help.

## 0. Testimonials for the landing page ("What travellers say")

The new landing page design has a testimonials section after "Our services". The API has no endpoint for it, so the frontend shows the three quotes from the Figma design until this endpoint returns testimonials, then switches to the API automatically.

- `GET /api/testimonials/` (public) returns `[{id, author_name, tour_name, rating, quote}]`, where `rating` is 1 to 5 and `tour_name` may be null. The landing page shows the first three, so the API should return them in display order.
- Admin CRUD under `/api/admin/testimonials` (list, create, update, delete, and a published or hidden flag) so the client can manage the quotes. The admin screen for it is not built yet.


## 1. Handoff doc corrections (no code change)

The live responses differ from the handoff in these places. The frontend now follows the live behaviour, so please update the doc, or tell us if the API is the part meant to change.

| Endpoint | Handoff says | Live API returns |
| --- | --- | --- |
| `GET /api/admin/extras` | "List routes return `{items, counts}`" | A plain array: `[{id, name, description, default_price_ghs, is_active, created_at}]` |
| `summary.tours_and_locations[]` (booking create response and `GET /api/admin/bookings/{id}`) | Tour with its chosen stops | `{tour_id, tour_name, country, region, selected_locations: [{location_id, location_name, order}]}` |
| `GET /api/admin/dashboard` → `recent_activity[].type` | `type` listed without values | `"created"` for a new booking and `"status_changed"` for a status move, with `to_status` set in both |
| `GET /api/admin/settings` | Seven fields | Also returns `logo_url` and `updated_at`. `phone` and `location` are `null` until set |
| `GET /api/admin/bookings/{id}` → `booking` | Customer fields | Also has `booking_locations` and `updated_at` |
| Event stops | Not described for admin | `POST`/`PATCH /api/admin/events` accept `location_ids`, and the public event exposes `locations`. Worth documenting |
| Event bookings | Only name, email, people, extras listed | `customer_age`, `customer_country` and `additional_services` are accepted and stored. Worth documenting |

## 2. Small improvements (optional)

1. **Extras: duplicate names are allowed.** Posting the same name twice creates two active extras. This happened during testing and would show up as duplicates in every extras picker. A unique constraint on the name (or a 409 with a clear message) would prevent it.
2. **Extras and bookings cannot be deleted.** Extras can only be deactivated, and bookings can only be cancelled. That is fine for production, but it leaves test data behind. Consider a delete for extras that are not attached to any booking, or a documented way to clear test data.
3. **Seat message grammar.** The 409 message reads "Only 1 seats left". "Only 1 seat left" would read better. The frontend shows the message as sent.
4. **Settings: no way to remove the logo.** `POST /api/admin/settings/logo` replaces it, but there is no `DELETE`. We did not upload a logo while testing, because it would replace the live one.
5. **Settings response shape.** `PUT /api/admin/settings` accepts extra fields such as `logo_url` and `updated_at` silently. That is harmless, but it hides client mistakes.

## 3. Please confirm (can't be checked from the frontend)

- `FRONTEND_URL` is set to the public site URL, so the set-password and forgot-password emails link to `{FRONTEND_URL}/admin/set-password?token=...`. We could not receive an email to check the link, and we did not test the set-password step against the live API.
- `CORS_ORIGINS` lists the production site origin. The API currently answers with `access-control-allow-origin: *` together with `allow-credentials: true`, which browsers ignore for credentialed requests. Bearer tokens still work, but a fixed origin list would be tidier.
- Each booking sends emails to the customer and the admin. Please confirm test bookings are expected to email the admin addresses, or give us a way to turn that off for test data.

## 4. Behaviour we verified and rely on

- Draft and scheduled tours and events are hidden from the public API, and publishing without a price returns 422.
- Server-side pricing matches the handoff: GHS 1,200 × 2 people + a GHS 400 extra returned `amount_ghs: 2800`, and an event at GHS 950 × 2 + a GHS 350 extra returned 2250.
- A tour with no price returns `amount_ghs: null`.
- Seat handling: `seats_left` drops on booking, returns when a booking is cancelled, and returns 409 "Only N seats left" when exceeded. Group size over tour capacity returns 400. Sending both tours and an event returns 422.
- Status moves are forward-only, with 409 on an invalid move such as paid → pending.
- Deleting a tour or event that has bookings returns 409. Lowering event capacity below `seats_booked` is blocked by the frontend before it reaches the API, so the backend's 409 for that case was not exercised.
- Image uploads for tours and events return Cloudinary URLs.
