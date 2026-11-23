# Backend changes: event pricing and form updates

The admin frontend now sends and expects the fields below. Please add them to the events API and return them on every event response.

## 1. New event price fields

Events can now have up to three prices. Only `price_ghs` is required.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `price_ghs` | integer, whole cedis | yes | Price per person |
| `sharing_price_ghs` | integer or `null` | no | Price for sharing |
| `couple_price_ghs` | integer or `null` | no | Price for a couple |

`sharing_price_ghs` and `couple_price_ghs` are new. Store them as nullable integer columns on events. `null` means the price is not offered. The frontend only shows a price when it is set.

### Request

`POST /api/admin/events/` and `PATCH /api/admin/events/{id}` (same routes the admin already uses):

```json
{
  "name": "Detty December",
  "countries": ["Ghana"],
  "description": "...",
  "destination": "Accra",
  "start_date": "2026-12-20",
  "end_date": "2026-12-27",
  "price_ghs": 2500,
  "sharing_price_ghs": 2000,
  "couple_price_ghs": 4500,
  "duration_days": 8,
  "capacity": 40,
  "highlights": ["Beach party", "Castle tour"],
  "status": "published",
  "publish_at": null,
  "location_ids": [1, 2]
}
```

Validation:
- `price_ghs`: required, whole number, 0 or more.
- `sharing_price_ghs` and `couple_price_ghs`: optional, whole number or `null`. An empty value from the frontend is sent as `null`.
- On `PATCH`, an explicit `null` must clear the stored price.

### Response

Return both new fields on every event payload: `GET /api/events/`, `GET /api/events/{id}`, and the admin list and detail endpoints.

```json
{
  "id": 8,
  "price_ghs": 2500,
  "sharing_price_ghs": 2000,
  "couple_price_ghs": null
}
```

Always include the keys, using `null` when unset, so the frontend can tell "not set" from "missing".

Where the frontend reads them:
- the upcoming-event banner on the landing page
- the admin event card preview
- the admin landing-page preview

The frontend field names are `sharing_price_ghs` and `couple_price_ghs`. If you prefer different names, tell us and we will rename them on our side.

## 2. Region is no longer sent for events

The event form no longer has a Region field, and `region` is no longer in the event request body. Please make `region` optional (or remove it) for events so creating an event without it does not fail validation. Tours still send `region`.

## 3. Tour price is no longer entered

The tour form no longer has a price field. New tours are created with `price_ghs: 0`. When an existing tour is edited, the frontend sends its current `price_ghs` back unchanged, so nothing is overwritten. If you want `price_ghs` to be optional on tours, make it nullable or default it to 0.

## 4. Location display uses `destination` only

The frontend now shows only `destination` as the location of an event. `country`, `countries` and `region` are no longer shown as the event location, so make sure `destination` is returned.

## 5. Highlights

The banner now renders `highlights` (array of strings) from the API instead of a fixed list. Return it on every event response, using `[]` when there are none.

## 6. Cover images are being cropped on upload

Event cover images stored in Cloudinary are all exactly 1200x800. The delivery URLs have no transformation in them, so the crop happens at upload. Please check the upload code for `upload-main-image` and `upload-gallery-images`, and the Cloudinary upload preset, for a `transformation` or `crop` option such as `crop: "fill"`.

- Remove the fixed-size crop.
- To cap the size without cropping, use `crop: "limit"` with a maximum width and height, for example 2000x2000.
- Flyers that were already uploaded stay cropped and have to be uploaded again.
- Fixed-size thumbnails can be made at delivery time instead, in the URL, for example `/upload/c_fill,w_600,h_400/...`.
