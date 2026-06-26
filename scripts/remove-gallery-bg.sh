#!/usr/bin/env bash
# Remove uniform letterbox padding from gallery images (corner floodfill only).
# Only AC and Unitus — all other projects use originals with styled backgrounds.
set -euo pipefail

FUZZ="${FUZZ:-10}"

process_image() {
  local src="$1"
  local dst="$2"

  magick "$src" -alpha on -channel A -evaluate set 100% +channel \
    -fuzz "${FUZZ}%" -fill none \
    -draw "color 0,0 floodfill" \
    -draw "color %[fx:w-1],0 floodfill" \
    -draw "color 0,%[fx:h-1] floodfill" \
    -draw "color %[fx:w-1],%[fx:h-1] floodfill" \
    "$dst"
}

if [[ $# -ge 2 ]]; then
  process_image "$1" "$2"
  exit 0
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ICLOUD="${ICLOUD_ROOT:-$HOME/Library/Mobile Documents/com~apple~CloudDocs/Proyectos/Novalink/ASPECT/Portafolio proyectos}"
PUB="$ROOT/public/images"

GALLERY="
AC Proyectos/ac_desktop_1x.webp:AC/ac_desktop_1x.webp
AC Proyectos/ac_mobile_1x.webp:AC/ac_mobile_1x.webp
Unitus/unitus_desktop_1x.webp:Unitus/unitus_desktop_1x.webp
Unitus/unitus_grid_desktop.webp:Unitus/unitus_grid_desktop.webp
Unitus/unitus_mobile_1x.webp:Unitus/unitus_mobile_1x.webp
"

count=0
while IFS= read -r entry; do
  [[ -z "$entry" ]] && continue
  src_rel="${entry%%:*}"
  dst_rel="${entry##*:}"
  src="$ICLOUD/$src_rel"
  dst="$PUB/$dst_rel"

  if [[ ! -f "$src" ]]; then
    echo "skip (missing source): $src_rel" >&2
    continue
  fi

  echo "processing: $dst_rel"
  process_image "$src" "$dst"
  count=$((count + 1))
done <<EOF
$GALLERY
EOF

echo "done ($count gallery images, corner-only fuzz=${FUZZ}%)"
