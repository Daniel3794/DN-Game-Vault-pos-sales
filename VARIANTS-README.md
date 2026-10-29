# Variants update (DN Game Vault)

One product can now have several variants (colour / pattern / size).
Each variant has its own price and stock. Products without `variants` work exactly as before.

## Firestore: products/{doc}
Add an optional array field `variants`:

    variants: [
      { name: "Style A+",   price: 15000, stock: 40 },
      { name: "Cyberpunk",  price: 28000, stock: 3  },
      { name: "Black Print", price: 28000, stock: 0, image: "https://..." }   // image optional
    ]

- When `variants` exists, the shop shows "from <lowest price>" on the card and a variant picker in the detail dialog.
- `price` / `stock` on the product itself are ignored for display, but are kept in sync:
  after each order `stock` = sum of all variant stock.
- Sold-out variants are disabled; stock <= 4 shows a "almost gone" badge.

## What changed
- assets/js/app.js      : unit()/ck() helpers, variant picker, cart keys "productId:variantIndex", WhatsApp text shows the variant
- assets/js/firebase.js : reads `variants`; saveOrder decrements the right variant (one write per product document, inside the transaction)
- assets/css/style.css  : styles appended at the end (.vopts, .vopt, .from)
- index.html            : unchanged

Order items now include `vi` (variant index, or null) next to `id`, `pid`, `name`, `qty`, `price`.
Old carts in localStorage still work (keys without ":").

## TODO for the developer
1. Backoffice/admin page (not part of this upload): add a "variants" editor to the product form
   (name, price, stock, optional image) and show per-variant stock on orders.
2. Firestore security rules: the shop page currently updates product stock and creates orders
   straight from the browser. Make sure the rules only allow public writes that
   - decrease `stock` / `variants` stock (never raise it, never change `price`, `name`, ...), and
   - create `orders` documents, but not read/update/delete them.
   Better: move order creation to a Cloud Function that re-reads prices from the database
   and calculates the total on the server (the total/prices sent by the browser can be forged).
3. index.html: replace `YOUR_DOMAIN` in the og:image tag with the real domain.

## Variant images
A variant can point to one of the product photos with `imageIndex` (set in the admin page).
In the product dialog, choosing that variant switches the big photo (and highlights its thumbnail);
variants without a photo show the first product photo. `image` (a direct URL) still works as an alternative.

## Pre-order
If `preorder: true` on the product and the product (or the chosen variant) has stock 0, the shop shows a purple "ສັ່ງຈອງ"
ribbon/button, lets the customer add up to 20 pcs, tags the cart/WhatsApp/order line with "[ສັ່ງຈອງ]" and does not deduct stock.
The order gets `hasPre: true`; order items get `pre: true`. Stock > 0 behaves as before (normal order, limited by stock).

## Categories (6)
Category list lives in `CATS` / `CI` (icons) / `LEG` (old name → new name) at the top of assets/js/app.js and in the `f-cat` select of the admin page.
Keep both lists identical. DESC / INC (text shown in the product dialog) are keyed by the same names.
