# Deploy Aspect Digital (Next.js) to a DigitalOcean Droplet

This guide walks you through deploying the Next.js site to a DigitalOcean droplet and connecting it to **Strapi Cloud** (or any Strapi instance) for content.

---

## Overview

| Component        | Where it runs                          |
|-----------------|----------------------------------------|
| **Next.js app** | Your DigitalOcean droplet (this guide) |
| **Strapi CMS**  | Strapi Cloud (you already have this)   |

The Next.js app on the droplet will fetch content from Strapi over HTTPS using environment variables.

---

## 1. Create a Droplet

1. In [DigitalOcean](https://cloud.digitalocean.com/droplets/new):
   - **Image:** Ubuntu 24.04 LTS (22.04 LTS also works if 24.04 isn’t available)
   - **Plan:** Basic shared CPU; **$6/mo** (1 GB RAM) is enough to start; **$12/mo** (2 GB) is more comfortable for Next.js builds
   - **Datacenter:** Choose one close to your audience
   - **Authentication:** SSH key (recommended) or password
   - **Hostname:** e.g. `aspect-digital-web`

2. Create the droplet and note its **IP address**.

---

## 2. First-Time Server Setup

SSH in (replace with your droplet IP and user if different):

```bash
ssh root@YOUR_DROPLET_IP
```

### Create a non-root user (recommended)

```bash
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Then use `deploy` for the rest:

```bash
su - deploy
```

### Basic security (optional but recommended)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # if you'll use Nginx; or later: sudo ufw allow 3000
sudo ufw enable
```

---

## 3. Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # should be v20.x
```

---

## 4. Install Git and Clone Your Repo

```bash
sudo apt-get install -y git
git clone https://github.com/ivandiaz92/aspect-digital.git aspect-digital
cd aspect-digital
```

*(If the repo is still named `Raven-Studios` on GitHub until you rename it, use that URL. After renaming, run `git remote set-url` — see `REPO_RENAME.md`.)*

Existing servers may still use the folder `~/ravenstudios-next`; that’s fine — `deploy.sh` works from any clone path.

If the repo is private, set up SSH keys or a deploy key for this server and clone via SSH URL.

---

## 5. Environment Variables (Production)

Create a production env file **on the server** (do not commit real secrets to Git):

```bash
cd ~/aspect-digital   # or ~/ravenstudios-next if you never renamed the folder
nano .env.production
```

Add (replace with your real values):

```env
# Your live site URL (for SEO, Open Graph, etc.)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Strapi — use your Strapi Cloud URL (must end with /api)
NEXT_PUBLIC_STRAPI_API_URL=https://your-project.strapiapp.com/api
STRAPI_API_TOKEN=your_strapi_api_token_from_strapi_cloud_admin

# Contact form (Resend)
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL_TO=hello@yourdomain.com
# CONTACT_FROM=Aspect Digital <contact@yourdomain.com>
```

- Get **Strapi Cloud URL** from your Strapi Cloud dashboard (e.g. `https://xxx.strapiapp.com` → API is `https://xxx.strapiapp.com/api`).
- Create an **API token** in Strapi Cloud: Admin → Settings → API Tokens → Create (e.g. “Production Next.js”), copy the token into `STRAPI_API_TOKEN`.

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

---

## 6. Build and Run with PM2

Install PM2 and build the app:

```bash
sudo npm install -g pm2
npm ci
npm run build
```

Start the app with the production env file:

```bash
pm2 start npm --name "aspect-digital" -- start
pm2 save
pm2 startup
```

Follow the command PM2 prints (e.g. run the `sudo env PATH=...` line) so the app restarts on reboot.

- App listens on **port 3000** by default.
- Visit `http://YOUR_DROPLET_IP:3000` to confirm it loads and content comes from Strapi.

---

## 7. (Optional) Nginx + SSL with Let’s Encrypt

To use a domain and HTTPS (e.g. `https://yourdomain.com`):

### Point your domain to the droplet

- Add an **A record**: `yourdomain.com` → `YOUR_DROPLET_IP`.

### Install Nginx and Certbot

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

### Nginx site config

```bash
sudo nano /etc/nginx/sites-available/aspect-digital
```

Paste (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/aspect-digital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Get SSL certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will configure HTTPS and auto-renewal.

---

## 8. Updating the Site (Deploy Script)

**Always deploy via Git + build.** Do not copy individual files (e.g. `page.tsx`) with `scp` into the app directory.

### Why the homepage can break if you copy files manually

If you run something like:

```bash
scp app/page.tsx app/portfolio/page.tsx user@server:/root/aspect-digital/app/
```

both files are named `page.tsx`. The second one **overwrites** the first, so you end up with two copies of the portfolio page and the real homepage is gone. The same risk exists any time you `scp` multiple files that share the same filename into the same destination directory.

### Safe way to deploy (recommended)

**Push from your machine first**, then on the **server**:

```bash
cd ~/aspect-digital   # or ~/ravenstudios-next on older servers
chmod +x scripts/deploy.sh   # once
./scripts/deploy.sh
```

The script **fetches and `git reset --hard origin/main`**. That way:

- Edits made only on the server (e.g. accidental `scp`) never block updates — they are replaced by GitHub.
- Production always matches the commit you pushed.

From your **local machine** (same as running deploy on the server):

```bash
ssh root@YOUR_DROPLET_IP 'cd ~/aspect-digital && ./scripts/deploy.sh'   # use ~/ravenstudios-next if that’s your folder
```

**If `git pull` ever fails** with “local changes would be overwritten”, don’t edit files on the droplet to fix it. Either run `./scripts/deploy.sh` (after it includes the reset logic), or once:

```bash
cd ~/aspect-digital && git fetch origin main && git reset --hard origin/main && ./scripts/deploy.sh
```

`.env.production` is not in Git — it is **not** removed by reset.

### Projects disappearing when Strapi Cloud is flaky

The app writes a **disk cache** at `.cache/strapi-projects.json` after successful full project list loads (home + portfolio use a full fetch). If Strapi returns errors or empty data for days, the site still shows the **last good list** (up to ~90 days). Ensure the app can write under the project root (e.g. `~/aspect-digital/.cache/`). After the first successful visit when Strapi is up, the cache is populated.

**Note:** Do not set `assetPrefix` in `next.config.js` for production at the domain root — it breaks static asset URLs. The repo leaves `assetPrefix` unset for that reason.

---

## 9. Checklist

- [ ] Droplet created (Ubuntu 24.04 LTS)
- [ ] Node 20 and Git installed
- [ ] Repo cloned
- [ ] `.env.production` created with Strapi Cloud URL, Strapi token, Resend, and `NEXT_PUBLIC_SITE_URL`
- [ ] `npm run build` and PM2 start work; site loads at `http://IP:3000`
- [ ] (Optional) Domain A record → droplet IP
- [ ] (Optional) Nginx + Certbot for HTTPS
- [ ] **Updates:** Always use `git pull` + build + PM2 restart (or `./scripts/deploy.sh`); never overwrite `app/` with `scp` of multiple same-named files

---

## Strapi: Keep Using Strapi Cloud

You don’t need to install Strapi on the droplet. The Next.js app only needs:

- `NEXT_PUBLIC_STRAPI_API_URL` = your Strapi Cloud API URL (e.g. `https://xxx.strapiapp.com/api`)
- `STRAPI_API_TOKEN` = a token from Strapi Cloud admin with read access to your content types

Content is managed in Strapi Cloud; the droplet just fetches it over the internet.
