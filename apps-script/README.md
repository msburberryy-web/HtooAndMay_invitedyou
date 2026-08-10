# RSVP → Google Sheet

This connects the wedding site's RSVP form to a Google Sheet, using a small
Apps Script bound to that sheet.

## Setup (about 5 minutes)

1. **Create a Google Sheet** (or open the one you want RSVPs to land in).
2. In the Sheet, go to **Extensions → Apps Script**.
3. Delete anything in the default `Code.gs` file, and paste in the full
   contents of `Code.gs` from this folder.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**, and authorize it when prompted (it needs permission to
   edit the spreadsheet it's bound to — that's expected).
8. Copy the **Web app URL** it gives you (ends in `/exec`).
9. Send me that URL — I'll paste it into `SHEET_ENDPOINT` in `index.html`
   and redeploy the site.

A sheet tab named `RSVPs` will be created automatically the first time
someone submits, with a header row already in place.

## If you ever update the script

Apps Script keeps old deployments live even after you edit the code — you
have to explicitly push a new version:

1. **Deploy → Manage deployments**
2. Click the pencil (edit) icon on the existing deployment
3. Under "Version," choose **New version**
4. Click **Deploy**

The URL stays the same, so nothing needs to change on the site's side.

## Notes

- The site sends the RSVP as `mode: "no-cors"`, so it can't read the
  response back — submissions will still work, they just won't show a
  success/failure toast tied to the sheet write itself (the site already
  shows its own "Thank you!" screen regardless).
- Each submission becomes one new row. Nothing is ever overwritten or
  deduplicated — if a guest submits twice (e.g. to change their answer),
  you'll see two rows. Sort by Timestamp to find the latest one per guest.
