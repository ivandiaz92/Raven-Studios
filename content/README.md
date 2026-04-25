# Content

This site uses local content instead of a hosted CMS.

## Projects

Add one JSON file per project in `content/projects`.

Required fields:
- `slug`
- `title`
- `date`
- `overview`

Optional fields:
- `liveUrl`
- `tools`
- `coverImage`
- `gallery`
- `conclusion`

Images should live in `public/` and be referenced with root-relative paths, for example:

```json
"/content/projects/my-project/cover.webp"
```

## Blog

Add one Markdown file per post in `content/blog` with frontmatter:

```md
---
slug: my-post
title: My Post
date: 2026-04-24
author: Ivan D
excerpt: Short summary.
coverImage: /content/blog/my-post/cover.webp
tags:
  - Design
---

Post content here.
```
