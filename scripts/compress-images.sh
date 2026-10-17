#!/usr/bin/env bash
# 포스트가 참조하는 public/images 이미지를 발행 전에 압축한다 (macOS sips 사용, 추가 설치 없음).
# - 긴 변 1600px 초과 시 1600px로 축소 (작은 이미지는 확대하지 않음)
# - JPEG는 500KB 초과 시 품질 80으로 재인코딩 (반복 실행해도 화질이 계속 깎이지 않게)
# ponytail: PNG는 축소만 함 (sips는 PNG 팔레트 압축 불가). 스크린샷 PNG가 계속 크면 pngquant/webp 변환 추가
# 사용법: scripts/compress-images.sh posts/my-post.mdx [더 많은 mdx...]
set -euo pipefail

MAX=1600
JPEG_LIMIT=$((500 * 1024))
cd "$(dirname "$0")/.."

for mdx in "$@"; do
  grep -oE '/images/[^ )"'"'"']+\.(png|jpe?g|PNG|JPE?G)' "$mdx" | sort -u | while read -r ref; do
    file="public$ref"
    [ -f "$file" ] || { echo "없음: $file"; continue; }

    before=$(stat -f%z "$file")
    tmp="$(mktemp -d)/$(basename "$file")"
    cp "$file" "$tmp"
    w=$(sips -g pixelWidth "$tmp" | awk '/pixelWidth/{print $2}')
    h=$(sips -g pixelHeight "$tmp" | awk '/pixelHeight/{print $2}')
    if [ "$w" -gt "$MAX" ] || [ "$h" -gt "$MAX" ]; then
      sips -Z "$MAX" "$tmp" >/dev/null
    fi
    case "$tmp" in
      *.jpg|*.jpeg|*.JPG|*.JPEG)
        if [ "$(stat -f%z "$tmp")" -gt "$JPEG_LIMIT" ]; then sips -s formatOptions 80 "$tmp" >/dev/null; fi ;;
    esac
    # sips가 PNG를 다시 저장하면 오히려 커질 수 있음 — 작아졌을 때만 교체
    if [ "$(stat -f%z "$tmp")" -lt "$before" ]; then mv "$tmp" "$file"; fi
    after=$(stat -f%z "$file")
    echo "$file: $((before / 1024))KB -> $((after / 1024))KB"
  done
done
