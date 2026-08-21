# Badmishop Frontend

## Stack
React 19 · Vite · TypeScript · React Query · Axios · React Router

## Quick start
```bash
cp .env.example .env
npm install
npm run dev
```

`.env`:
```
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=<Google Web Client ID>
```

Auth pages: `/dang-nhap`, `/dang-ky`, `/quen-mat-khau`, `/dat-lai-mat-khau`, `/xac-thuc-email`.

Google Console origins/redirect: `http://localhost:5173`

## Conventions
- API responses unwrap `ApiResponse.data` via `src/api/unwrap.ts`
- Cart uses **`variantId`**
- Shop pages load from BE (Home / Products / ProductDetail / Cart / Wishlist / Orders)
- Admin routes require `role === 'admin'`
- Register → verify email (link in BE console if SMTP unset) → login; Google login skips verify
