# Strapi content-type schemas

These JSON files define the collection types that the Next.js app expects.

- **portfolio** – Projects for the portfolio section.
- **blog-post** – Blog posts (Latest Insights).
- **quote-request** – Quote/brief submissions from the contact page form (“Get in touch”). Submissions are created via `POST /api/quote-requests` (from the Next.js API route `/api/quote`).

Use the JSON as reference when creating content types in the Strapi Content-Type Builder, or copy into your Strapi project (see **STRAPI_SETUP.md** → Option B).

---

## Why you don’t see “Quote Request” in Strapi

The file `quote-request/schema.json` is only a **reference**. Strapi does **not** read it automatically. You have to create the content type **inside your Strapi project** (Strapi Cloud or self-hosted) using the Content-Type Builder.

### How to create Quote Request in Strapi (step by step)

1. **Open your Strapi admin** (e.g. your Strapi Cloud URL or `http://localhost:1337/admin`).
2. Go to **Content-Type Builder** (left sidebar).
3. Click **Create new collection type**.
4. **Display name:** `Quote Request` (API ID will become `quote-request`).
5. Click **Continue**, then add the attributes below. When you’re done, click **Save** and restart if you’re self-hosting.

**Attributes to add** (name = API name; type as below; only the first three are required):

| Name | Type | Required |
|------|------|----------|
| company_name | Text (Short) | ✓ |
| contact_name | Text (Short) | ✓ |
| email | Text (Short) | ✓ |
| social_networks | Text (Long) | |
| sections_needed | Text (Long) | |
| sections_modify | Text (Short) | |
| sections_specify | Text (Long) | |
| site_has_blog | Text (Short) | |
| google_analytics_global | Text (Short) | |
| measurement_tags | Text (Short) | |
| site_objective | Text (Short) | |
| show_products_services | Text (Short) | |
| quantity_approximate | Text (Short) | |
| info_level | Text (Short) | |
| has_domain | Text (Short) | |
| domain_provider | Text (Short) | |
| has_hosting | Text (Short) | |
| hosting_preference | Text (Short) | |
| project_type | Text (Short) | |
| current_site_url | Text (Short) | |
| additional_functionality | Text (Short) | |
| functionality_types | JSON | |
| functionality_description | Text (Long) | |
| maintenance_plan | Text (Short) | |
| support_types | JSON | |

6. **Permissions:** go to **Settings → Users & Permissions → Roles**. Open the role used by your API token (e.g. **Public** or a custom “Next.js” role). Under **Quote Request**, enable **create** only (so the form can submit). Leave **find** and **findOne** disabled if you want only admins to see submissions in the Content Manager.

After this, “Quote Request” will appear under Content Manager and new submissions from the site will show up there.

---

For **Quote Request**: after creating the content type in Strapi, give the **Public** role (or the role used by your API token) **create** permission on `quote-request` so the contact form can submit. Do not expose **find** or **findOne** to public if you want submissions to be admin-only.
