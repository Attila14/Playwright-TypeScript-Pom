npx playwright test -g 'standard user can log in and land on the inventory page' --headed


# run a single file
npx playwright test tests/login.spec.ts

npx playwright test tests/login.spec.ts  --workers=3


# run in UI mode (interactive, great for debugging)
npx playwright test --ui