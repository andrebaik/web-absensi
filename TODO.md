# TODO - Responsive UI Fixes (ASINETKW)

## Step 1: Repo understanding
- [x] Identify layout/components/pages that affect responsiveness.
- [x] Inspect DashboardLayout, DataTable, Modal, ConfirmDialog, StatCard.
- [x] Inspect key pages (admin, dosen, mahasiswa, login/forgot).

## Step 2: Build responsive base styles
- [ ] Ensure global CSS exists and contains responsive rules for:
  - dashboard layout + mobile sidebar drawer
  - page header
  - stats grid
  - table controls + horizontal scroll wrapper
  - forms grid
  - modal + confirm dialog sizes (<= 92-95vw, max 90vh)

## Step 3: Fix Sidebar/Header responsiveness
- [ ] Update DashboardLayout + (if needed) CSS to prevent content overlapping.
- [ ] Ensure hamburger drawer works and main content shifts correctly.

## Step 4: Fix DataTable responsiveness
- [ ] Ensure table wrapper has overflow-x-auto.
- [ ] Make table controls stack vertically on mobile.
- [ ] Make action buttons not overflow.

## Step 5: Fix page header/button responsiveness
- [ ] Make page header stack on mobile and action button full width.

## Step 6: Fix Forms layout in modals
- [ ] Ensure form grid becomes 1 column on mobile.
- [ ] Ensure inputs/selects width 100% and errors align.

## Step 7: Fix Modal & ConfirmDialog on mobile
- [ ] Adjust modal width/margins for mobile and make body scrollable.
- [ ] Adjust confirm dialog width and button layout on small screens.

## Step 8: Fix Login + Forgot Password pages
- [ ] Verify centered card and padding on mobile.

## Step 9: Page-specific checks
- [ ] Admin pages: headers, tables, forms, modals.
- [ ] Dosen pages: rekap/dashboard/cards and tables.
- [ ] Mahasiswa pages: same checks.

## Step 10: Testing & build
- [ ] Test responsive at 375/414/768/1024.
- [ ] Run `npm run build` and fix any build errors.

