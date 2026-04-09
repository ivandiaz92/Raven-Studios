# Rename the GitHub repository to **aspect-digital**

Do this on GitHub (the remote URL must match before `git push` from a renamed local setup).

1. Open the repo on GitHub → **Settings** → **General** → **Repository name**.
2. Set name to: **`aspect-digital`** (or `Aspect-Digital` — GitHub will normalize; prefer lowercase hyphen).
3. Save.

### Update Git on your Mac

```bash
cd /path/to/this-project
git remote set-url origin https://github.com/ivandiaz92/aspect-digital.git
# If you use SSH:
# git remote set-url origin git@github.com:ivandiaz92/aspect-digital.git
git remote -v   # verify
```

### Update Git on the droplet (after you push at least once to the new name)

```bash
ssh root@YOUR_DROPLET_IP
cd ~/ravenstudios-next   # or ~/aspect-digital if you renamed the folder
git remote set-url origin https://github.com/ivandiaz92/aspect-digital.git
git fetch origin
```

Optional: rename the folder on the server (not required for deploy):

```bash
mv ~/ravenstudios-next ~/aspect-digital
# Then update any scripts/cron that cd into the old path.
```

Your **live site URL** (e.g. ravenstud.io) does not change when you rename the repo.
