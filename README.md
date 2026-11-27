# DS-160 Autofill

Fill a new US visa **DS-160** in minutes by reusing the one you submitted last time.

1. **Profile Maker** (`index.html`) reads the "Print Application" PDF of your previous DS-160 **inside your browser** and turns it into a profile (JSON).
2. **Autofill script** (`ds160-autofill.user.js`) is a Tampermonkey script that fills the new DS-160 from that profile, page by page.

You still review every page, type your ID numbers, and sign and submit yourself.

> This is an unofficial helper. It is not affiliated with the U.S. Department of State. You are responsible for every answer you submit. Check each page before you sign.

---

## Privacy

- The PDF is read in your own browser. Nothing is uploaded anywhere.
- Nothing is copied from the old PDF for these:
  passport number, SSN / ITIN, driver's licence number, receipt/petition number, and the visa number and issue date.
  You type the passport number, SSN/ITIN and licence number on the form. You enter the new receipt number and your **most recent** visa's number and issue date on the Profile Maker page, or type them on the form.
- The script runs only on `ceac.state.gov`, makes no network requests, keeps the profile only until you close the tab, and never clicks **Next**, **Sign** or **Submit**.
- The only thing to keep between applications is your **Print Application PDF**. Profiles are made fresh each time and don't need to be saved. If you do save one, keep it private: it contains your name, address and family details. This repo's `.gitignore` blocks `*.pdf` and `*profile*.json` so you don't commit them by accident.

---

## What you need

1. The **"Print Application" PDF** of your previous DS-160, one per person.
   If you don't have it, try **Retrieve an Application** on [ceac.state.gov](https://ceac.state.gov/genniv/). It only works for a limited time after submitting. Then click **Print Application** and save it as a PDF. A scan or photo will **not** work.
2. Chrome, Edge or Firefox on a computer.
3. Your current passport, your latest US visa stamp, your I-797 / receipt notice, and your [I-94 travel history](https://i94.cbp.dhs.gov) for recent US visits.

---

## Part 1: Install the script (once per computer)

1. Install the free **Tampermonkey** extension from your browser's extension store.
2. **Chrome / Edge:** open `chrome://extensions`, click **Details** under Tampermonkey, and turn on **Allow User Scripts**. On older versions, turn on **Developer mode** (top-right) instead.
3. Install the script, either way:
   - **Easiest:** open [`ds160-autofill.user.js`](ds160-autofill.user.js) on GitHub and click **Raw**. Tampermonkey offers to install it. Click **Install**.
   - **Or:** open the Profile Maker, click **Copy the Tampermonkey script**, then Tampermonkey icon → **Create a new script** → replace everything → **File → Save** (use *Save*, not *Save to disk*).
4. In the Tampermonkey Dashboard, **DS-160 Autofill** should be switched on.

> Only the **script** goes into Tampermonkey. Never paste a profile there. That causes ESLint errors.

---

## Part 2: Make a profile (per person, per application)

1. Open the Profile Maker. Use the GitHub Pages link for this repo, or download `index.html` and double-click it. It needs internet the first time it opens, to load the PDF reader from cdnjs.
2. Drop the old PDF on the box, or click it to choose the file.
3. Under **Update for this application**, enter:
   - the arrival date, receipt/petition number (from the new I-797), length of stay, and monthly salary if it's shown
   - your **most recent US visa's number and issue date** (the red number and date on the newest visa stamp). Leave them blank if you've never had a US visa.
   - **New passport:** if the old passport is expired or expires within 6 months, this section opens by itself, outlined in red. Enter where and when the new passport was issued; the passport number is typed on the form. Open it yourself if you renewed early.

   Then click **Apply to profile**.
4. Read **Check before you submit**. It lists what is out of date or must be typed by hand: an expired passport, new US visits, "Yes" answers, the preparer, and so on.
5. Click **Copy profile**, then go straight to Part 3 and paste it into the Autofill box.
   You don't need to save the profile. Next time, drop the new **Print Application** PDF in again and get a fresh one. You can also edit the profile text on the page before copying it.

**Command line (optional):** `npm install`, then `node tools/pdf2profile.js old.pdf` prints the profile.

---

## Part 3: Fill the DS-160

1. Go to <https://ceac.state.gov/genniv/> and pass the "verify you are human" check.
2. Choose the consulate location, type the CAPTCHA, and click **Start an Application**.
3. **Write down the Application ID.** Choose a security question and answer it.
4. In the **DS-160 Autofill** box (bottom-right), click **Load / clear profile**, paste the profile, and click **Load**.
5. On every page:
   1. Click **Fill this page**. The page may reload a few times while it answers Yes/No questions and adds rows; the script carries on by itself.
   2. Type what it can't fill: ID numbers, new information, any field shown in red.
   3. Read the page and fix anything that has changed.
   4. Click **Next** yourself.
6. **Security and Background:** the script answers "No" only if every answer was "No" last time. Read every question anyway, because you are signing them.
7. On the final page, review, then **Sign and Submit** yourself.
8. Save both of these as PDF:
   - the **Confirmation page**, which you bring to the interview (the barcode must be clear)
   - **Print Application**, which is the PDF you'll use next time
9. Close the tab, which clears the profile from the browser. Repeat for each family member.

---

## Tips

- The site **logs you out after about 20 minutes** without a save. Click Next or Save regularly. If it times out, use **Retrieve an Application** with the Application ID, the first 5 letters of the surname, the year of birth and the security answer.
- **US visits:** the form keeps your **last five**. Use your I-94 history, and update the length of the most recent stay.
- **Previous employers:** the form holds only **two**.
- **Children:** a child's form may need a **preparer** (parent) on the sign page.
- Arrival dates can be estimates.
- The DS-160 no longer offers a saved `.dat` file, so the **Print Application PDF** is your record.

## Troubleshooting

| Problem | Fix |
|---|---|
| No "DS-160 Autofill" box | Turn on **Allow User Scripts** (Part 1, step 2), check that the script is on in the Dashboard, and reload. The box appears only on `ceac.state.gov` DS-160 pages. |
| ESLint / red errors in Tampermonkey | A profile was pasted as a script. Delete that entry. Profiles go into the box on the DS-160 page. |
| "This does not look like a DS-160 Print Application PDF" | Use CEAC's **Print Application** PDF, not a scan or the confirmation page. |
| A page doesn't fill, or only partly fills | Fill it by hand. The State Department changes the form from time to time; please open an issue. |
| "Verifying you are human" keeps looping | Use your normal browser window, not an automated or private one, and wait a few seconds. |

---

## For developers

```
src/extract.js          PDF text items -> ordered label/answer rows (layout of the CEAC print PDF)
src/mapper.js           rows -> profile { pages: { <DS-160 page node>: { <field id>: value, _rows, _allNo, _postback } } }
src/page.template.html  Profile Maker UI (inlines the two files above + the userscript)
tools/build.py          builds index.html from src/  ->  python3 tools/build.py
tools/pdf2profile.js    command-line converter
ds160-autofill.user.js  Tampermonkey script that applies a profile
```

**Profile format.** The keys are the DS-160 page names from the URL (`?node=Personal1`, `Travel`, `PreviousUSTravel`, …). Field keys are element IDs without the `ctl00_SiteContentPlaceHolder_FormView1_` prefix.
- `rbl…` keys take `"Y"` or `"N"`.
- `_rows` fills repeating lists, using **Add Another**.
- `_allNo` answers every question on a security page "No".
- `_postback` lists dropdowns that reveal more fields.

After changing anything in `src/`, run `python3 tools/build.py` and commit the new `index.html`.

**Host the Profile Maker:** in **Settings → Pages**, deploy from the `main` branch, root folder. `index.html` is served as is.
