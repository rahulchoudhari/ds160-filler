# DS-160 Filler

Fill a new US visa **DS-160** in minutes by reusing the one you submitted last time.

### 👉 [Open the DS-160 Profile Maker](https://rahulchoudhari.github.io/ds160-filler/)

Everything you need is on that page: it reads your old DS-160 PDF, asks what changed, and gives you the autofill script with setup steps.

> **Unofficial tool.** Not affiliated with, endorsed by, or connected to the U.S. Department of State or CEAC. Not legal or immigration advice. You review every page, type your ID numbers, and sign and submit yourself. You are responsible for every answer. See the [disclaimer](#disclaimer).

---

## How it works

1. **Install the autofill script (once).** Install the free **Tampermonkey** browser extension, then [click here to install the script](https://github.com/rahulchoudhari/ds160-filler/raw/main/ds160-autofill.user.js) and choose **Install**.
   - **Chrome / Edge:** open `chrome://extensions`, click **Details** under Tampermonkey, and turn on **Allow User Scripts**. Without this, the script won't run.
2. **Make a profile on the [Profile Maker](https://rahulchoudhari.github.io/ds160-filler/).**
   1. Drop in the **Print Application PDF** of your previous DS-160.
   2. Enter what's new: arrival date, length of stay, receipt/petition number, your most recent visa's number and issue date, and salary.
   3. If your passport is expired or expires within 6 months, the page asks for the new passport's details.
   4. Read the checklist, then click **Copy profile**.
3. **Fill the DS-160.**
   1. Go to [ceac.state.gov/genniv](https://ceac.state.gov/genniv/). Choose your location, enter the CAPTCHA, start the application, and **write down the Application ID**.
   2. In the **DS-160 Autofill** box (bottom-right), paste the profile and click **Load**.
   3. On every page, click **Fill this page**, type your ID numbers, check everything, then click **Next** yourself.
   4. At the end, review, then **Sign and Submit**.
   5. Save the **Confirmation page** and **Print Application** as PDFs. That PDF is what you drop in next time.

Repeat steps 2–3 for each family member. Make one profile per person.

---

## What you need

- The **Print Application PDF** of your previous DS-160. A scan or photo won't work. If you don't have it, try **Retrieve an Application** on CEAC, which only works for a limited time after submitting.
- Chrome, Edge or Firefox on a computer.
- Your current passport, the newest US visa stamp, your I-797 / receipt notice, and your [I-94 travel history](https://i94.cbp.dhs.gov).

## Privacy

- Your PDF is read **inside your browser**. Nothing is uploaded, and the page runs fine from GitHub Pages or from a downloaded copy.
- Nothing is copied from the old PDF for: passport number, SSN/ITIN, driver's licence number, receipt/petition number, or visa number and date.
  - Type the passport number, SSN/ITIN and licence number on the form.
  - Enter the new receipt number and your most recent visa's details on the Profile Maker page.
- The script runs only on `ceac.state.gov`. It makes no network requests, forgets the profile when you close the tab, and never clicks **Next**, **Sign** or **Submit**.
- You don't need to save the profile. Keep only your **Print Application PDF**.

## Tips

- CEAC **logs you out after about 20 minutes** without saving. To resume, use **Retrieve an Application** with your Application ID.
- The form keeps your **last five US visits** and **two previous employers**.
- A child's form may need a **preparer** (parent) on the sign page.
- Security questions are pre-answered "No" only if every answer was "No" last time. Read each one anyway.

## Troubleshooting

| Problem | Fix |
|---|---|
| No "DS-160 Autofill" box on CEAC | Turn on **Allow User Scripts** for Tampermonkey, check the script is enabled in its Dashboard, then reload the page. |
| Red ESLint errors in Tampermonkey | A profile was pasted into Tampermonkey by mistake. Delete that entry. Profiles go into the box on the DS-160 page. |
| "This does not look like a DS-160 Print Application PDF" | Use the PDF from CEAC's **Print Application**, not a scan or the confirmation page. |
| A page doesn't fill, or only partly | Fill it by hand. CEAC changes the form from time to time; please [open an issue](https://github.com/rahulchoudhari/ds160-filler/issues). |
| "Verifying you are human" keeps looping | Use your normal browser window and wait a few seconds. |

---

## What's in this repo

| File | What it is |
|---|---|
| `index.html` | The Profile Maker: one self-contained page, served by GitHub Pages. It also includes a copy of the script with a **Copy** button. |
| `ds160-autofill.user.js` | The Tampermonkey script, kept as its own file so the install link works. |
| `README.md` | These instructions. |
| `LICENSE` | MIT license. |

To run it offline, download `index.html` and double-click it. It needs internet once, to load the PDF reader from cdnjs.

<details>
<summary><b>Profile format (for anyone editing a profile)</b></summary>

`{ pages: { <page name from the URL's ?node=…>: { <field id without the ctl00_SiteContentPlaceHolder_FormView1_ prefix>: value } } }`
- `rbl…` fields take `"Y"` or `"N"`.
- `_rows` fills repeating lists, using **Add Another**.
- `_allNo` answers every question on a security page "No".
- `_postback` lists dropdowns that reveal more fields.

If you change the script, update it in both places: `ds160-autofill.user.js` and its copy inside `index.html`.
</details>

---

## Disclaimer

- **Unofficial.** This project is not affiliated with, endorsed by, or connected to the U.S. Department of State, the Bureau of Consular Affairs, or the Consular Electronic Application Center (CEAC). "DS-160" and "CEAC" are used only to describe what the tool works with.
- **Not legal or immigration advice.** For questions about your visa, eligibility or how to answer a question, use [travel.state.gov](https://travel.state.gov) or a qualified immigration attorney.
- **You are the applicant.** The tool only copies answers you gave before into fields on your own screen. It does not sign, submit, solve CAPTCHAs or click **Next**. Under 22 C.F.R. 41.103 you must electronically sign and submit your own application unless you qualify for an exemption, and every answer must be true and current. If someone else prepares an application for you, list them as the preparer on the Sign and Submit page.
- **Use it as a helper, not on autopilot.** Read every page before moving on. CEAC can change its form or its terms at any time, and it's your responsibility to follow CEAC's rules when you use its site.
- **No warranty.** This software is provided "as is", without warranty of any kind. The authors are not liable for any errors, refusals, delays or other consequences of its use.
- **Privacy.** Your PDF and profile stay in your browser. The authors never receive your data.

## License

[MIT](LICENSE) © 2026 Rahul Choudhari. You're free to use, change and share it. It comes with no warranty.
