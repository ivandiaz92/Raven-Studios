---
slug: local-content-over-cms
title: Cuándo el contenido local gana a un CMS en la nube
date: 2026-04-20
author: Ivan D
excerpt: En sitios de portafolio pequeños, el contenido local puede ser más rápido, barato y fácil de mantener que un CMS alojado.
coverImage: /images/blog/blog-local-content-cover.png
tags:
  - Next.js
  - Contenido
  - Flujo de trabajo
---

Un CMS en la nube tiene sentido cuando equipos no técnicos necesitan publicar seguido, con roles, previews y flujos de aprobación.

Para un portafolio o sitio de estudio pequeño, a veces es más infraestructura de la que el proyecto necesita.

## Mantén el flujo cerca del sitio

Los proyectos pueden vivir como JSON porque son datos estructurados. Las entradas del blog pueden vivir como Markdown porque son texto. Las imágenes van en `public/`, donde Next.js las sirve directo.

Eso te da un flujo de contenido simple, versionado y sin depender de límites de uso externos.

## El tradeoff

Pierdes un panel de administración en el navegador, pero ganas confiabilidad y control. Para un sitio de estudio ágil, ese intercambio suele valer la pena.
