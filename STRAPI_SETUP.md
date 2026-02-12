# Strapi setup for Raven Studios

Use Strapi as the CMS to manage **Portfolio** projects and **Blog** posts. The Next.js app is already configured to read from Strapi at `http://localhost:1337/api`.

---

## Strapi admin URL

- **Local Strapi (default):** Open **http://localhost:1337/admin** in your browser. If you only try **http://localhost:1337**, some setups redirect you to the admin; others show a welcome page—use **/admin** to be sure.
- **Different port:** If you started Strapi on another port, use that port (e.g. **http://localhost:1338/admin**).
- **Strapi Cloud or hosted:** Use the URL your host gives you for the admin (e.g. **https://your-app.strapiapp.com/admin** or similar).

The **API** for the Next.js app is always the same host + **/api** (e.g. **http://localhost:1337/api**).

---

## Using your "Project" content type and API token

The Next.js app is wired to your Strapi **Project** collection (`client_name`, `project_description`, `main_mockup`). It fetches from `/api/projects` and uses an **API token** when you set one in the app.

1. **Revoke the token you pasted anywhere** (chat, docs, etc.): in Strapi admin go to **Settings → API Tokens**, find that token, and revoke/delete it. Create a **new** token (e.g. "Next.js app") with **Read** access to **Project** (and any other types you need).
2. **Put the new token in the Next.js app only** – never in code or chat. In the Next.js project root, create or edit `.env.local` and add:
   ```env
   NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
   STRAPI_API_TOKEN=your_new_token_here
   ```
3. Restart the Next.js dev server (`npm run dev`). The home carousel and **Portfolio** page will list projects from Strapi; project detail URLs are `/portfolio/1`, `/portfolio/2`, etc. (by Strapi document id).

---

## Checklist: Why aren’t my projects showing?

Use this to verify each requirement. **Quick test:** with the Next.js app running (e.g. on port 3001), open **http://localhost:3001/api/strapi-check** in your browser. It returns JSON showing `ok`, `hasToken`, and `projectCount` so you can see if the connection works and how many projects were returned.

| Check | How to verify |
|-------|----------------|
| **1. Strapi running (port 1337)** | In a terminal you ran `npm run develop` from the Strapi project folder and left it running. Open **http://localhost:1337/admin** — you should see the Strapi login or dashboard, not “site can’t be reached”. |
| **2. Token in .env.local** | In the **Next.js** project folder (`ravenstudios-next`), open `.env.local` (create it if missing). It must contain a line: `STRAPI_API_TOKEN=your_actual_token` (no quotes). Restart the Next.js dev server after changing it. The **strapi-check** response shows `hasToken: true` when the token is set. |
| **3. Project content type has “find” permission** | In Strapi admin go to **Settings** (left sidebar) → **Users & Permissions** → **Roles**. Open **Public** (or the role your API token uses). Under **Project**, enable **find** (and **findOne** if you use project detail pages). Click **Save**. |
| **4. Entry published** | In Strapi admin go to **Content Manager** → **Project**. Open your project entry. If you use **Draft & Publish**, the entry must be **Published** (green). If it’s still a draft, click **Publish**. Only published entries are returned by the API. |

**If projects show but with “no image” / only a letter:** In Strapi, open each **Project** entry and set the **main_mockup** (or “Main mockup”) field: click the media field, upload an image or pick one from the library, then save and publish. The site will show that image in the carousel and portfolio. Until then, a placeholder (first letter of the project name) is shown.

After fixing any of the above, open **http://localhost:3001/api/strapi-check** again: `ok: true` and `projectCount: 1` (or more) means the Next.js app can see your projects. Then refresh your site (e.g. http://localhost:3001) and the carousel / portfolio list should show them.

---

## "The site can't be reached" at http://localhost:1337

That means **Strapi is not running**. You need to:

1. **Create** the Strapi project once (Step 1 below).
2. **Start** Strapi whenever you want to use it: in a terminal run `cd .../ravenstudios-strapi` then `npm run develop`. Keep that terminal open. When you see something like `Server started on http://localhost:1337`, then http://localhost:1337 and http://localhost:1337/admin will work.

If you haven’t run Step 1 yet, there is no Strapi app on your machine, so nothing is listening on port 1337.

---

## 1. Create the Strapi project (one-time)

Open a **terminal** (Cursor: Terminal → New Terminal). Run:

```bash
cd /Users/ivandiaz/Documents/Development
npx create-strapi-app@4 ravenstudios-strapi --quickstart
```

- If it asks to **log in or sign up** (Strapi Cloud), choose **Skip** with the arrow keys and Enter.
- **--quickstart** uses SQLite and will start the server when the install finishes.
- When the browser opens, **create the first admin user** (email + password). You’ll use this for http://localhost:1337/admin.

Leave Strapi running in that terminal, or stop it with `Ctrl+C`. To start Strapi again later:

```bash
cd /Users/ivandiaz/Documents/Development/ravenstudios-strapi
npm run develop
```

When Strapi is running, http://localhost:1337/api will respond (and the admin is at http://localhost:1337/admin).

---

## 2. Add the content types

You need two collection types: **Portfolio** and **Blog Post**. Either use the Content-Type Builder (recommended first time) or copy the provided schemas.

### Option A – Content-Type Builder (recommended)

In Strapi admin: **Content-Type Builder** → **Create new collection type**.

#### Portfolio

1. **Display name:** `Portfolio`  
   **API ID (singular):** `portfolio`  
   **API ID (plural):** `portfolios`  
   (Strapi may suggest this; confirm it.)
2. Add these fields (click **Add another field** for each):

| Name              | Type        | Options / notes                          |
|-------------------|-------------|------------------------------------------|
| title             | Text (short)| Required                                 |
| slug              | UID         | Attached to: **title**, Required        |
| description       | Text (long) | Required                                 |
| shortDescription  | Text (short)| Required (for cards)                     |
| featuredImage     | Media       | Single image, Required                   |
| images            | Media       | Multiple images (gallery)                |
| technologies      | JSON        | Optional; store as `["React","Next.js"]` |
| projectUrl        | Text (short)| Optional (live site URL)                 |
| githubUrl         | Text (short)| Optional                                 |
| category          | Enumeration | Required. Values: **Web Development**, **Mobile App**, **Design**, **Other** |
| featured          | Boolean     | Default: false                           |

3. Under **Advanced settings** for the collection type, enable **Draft & Publish** if you want drafts.
4. Save. Strapi will restart.

#### Blog Post

1. **Create new collection type** again.  
   **Display name:** `Blog Post`  
   **API ID (singular):** `blog-post`  
   **API ID (plural):** `blog-posts`
2. Add these fields:

| Name          | Type         | Options / notes                |
|---------------|--------------|--------------------------------|
| title         | Text (short) | Required                       |
| slug          | UID          | Attached to: **title**, Required |
| excerpt       | Text (short) | Required (preview)             |
| content       | Rich text    | Required                       |
| featuredImage | Media        | Single image, Required         |
| author        | Text (short) | Required                       |
| tags          | JSON         | Optional; e.g. `["news","dev"]` |

3. Enable **Draft & Publish** if you want.
4. Save.

### Option B – Use the provided schemas

Pre-built schemas are in this repo under **strapi-schema/**:

- `strapi-schema/portfolio/schema.json`
- `strapi-schema/blog-post/schema.json`

To use them:

1. In Strapi admin, create a **Portfolio** collection type with one temporary field (e.g. a short text), then save.  
   This creates `ravenstudios-strapi/src/api/portfolio/content-types/portfolio/`.
2. Stop Strapi (`Ctrl+C`).
3. Copy:
   - `strapi-schema/portfolio/schema.json` →  
     `ravenstudios-strapi/src/api/portfolio/content-types/portfolio/schema.json`  
     (overwrite the existing file.)
4. Repeat for Blog Post: create a **Blog Post** type with one field, save, then replace its `schema.json` with `strapi-schema/blog-post/schema.json`.
5. Start Strapi again: `npm run develop`.

---

## 3. Permissions

In Strapi admin:

1. **Settings** (left) → **Users & Permissions** → **Roles** → **Public**.
2. Under **Portfolio**, enable:
   - **find** (list)
   - **findOne** (single by id/slug).
3. Under **Blog Post**, enable:
   - **find**
   - **findOne**.
4. Save.

Your Next.js app only needs public read access to these two content types.

---

## 4. Next.js environment

In the **Next.js** project (ravenstudios-next), ensure `.env.local` has:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
```

For production, point this to your deployed Strapi URL (e.g. `https://your-strapi.example.com/api`).

---

## 5. Add content and test

1. In Strapi: **Content Manager** → **Portfolio** → **Create new entry**.  
   Fill title, slug, descriptions, featured image, technologies (as JSON array), category, optional URLs, and set **featured** if you want it on the home carousel. Then **Publish**.
2. Create a few portfolio entries and at least one **Blog Post** (Content Manager → Blog Post).
3. Run the Next.js app (`npm run dev` in ravenstudios-next) and open:
   - Home: should show portfolios (e.g. carousel).
   - `/portfolio`: list of projects.
   - `/portfolio/[slug]`: single project.
   - `/blog`: list of posts.
   - `/blog/[slug]`: single post.

---

## Technologies and tags (JSON fields)

- **technologies** (Portfolio) and **tags** (Blog Post) are **JSON** fields.
- In Strapi, enter a JSON array of strings, for example:
  - `["React", "Next.js", "TypeScript"]`
  - `["news", "tutorial"]`
- The Next.js app uses these as arrays (e.g. for badges and filters).

---

## Summary

| Step | Action |
|------|--------|
| 1 | `npx create-strapi-app@4 ravenstudios-strapi --quickstart` and create admin user |
| 2 | Add **Portfolio** and **Blog Post** collection types (Builder or copy schema) |
| 3 | Public role: enable **find** and **findOne** for Portfolio and Blog Post |
| 4 | Set `NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api` in Next.js `.env.local` |
| 5 | Add content in Strapi and check home, `/portfolio`, and `/blog` in the Next.js site |

Once this is done, you can manage all projects (and blog posts) from Strapi and the site will reflect the content.
