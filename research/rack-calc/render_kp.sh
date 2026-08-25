#!/bin/bash
# Рендер склада по сцене из генератора КП.
#
#   ./render_kp.sh ~/Downloads/KP-260825-305.scene.json
#
# Кладёт рядом со сценой три кадра: общий вид, взгляд вдоль прохода и фасад
# ряда. Их менеджер загружает в КП как «Рендер расстановки».
#
# Blender в системе не установлен — берём его со смонтированного образа.
# Если образ не смонтирован, скрипт скажет, что делать, и не станет гадать.
set -euo pipefail

SCENE="${1:?Укажите путь к JSON-сцене из генератора}"
OUTDIR="$(cd "$(dirname "$SCENE")" && pwd)"
NAME="$(basename "$SCENE" .scene.json)"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BLENDER=""
for candidate in \
  "/Volumes/Blender/Blender.app/Contents/MacOS/Blender" \
  "/Applications/Blender.app/Contents/MacOS/Blender" \
  "${BLENDER_PATH:-}"
do
  [ -n "$candidate" ] && [ -x "$candidate" ] && BLENDER="$candidate" && break
done

if [ -z "$BLENDER" ]; then
  cat >&2 <<'MSG'
Blender не найден.

Он не ставится в систему — запускается прямо со смонтированного образа:
  1. Скачать blender.org/download (macOS Apple Silicon, .dmg)
  2. Открыть образ двойным щелчком — он смонтируется как /Volumes/Blender
  3. Повторить эту команду

Либо задать путь вручную: BLENDER_PATH=/путь/к/Blender ./render_kp.sh scene.json
MSG
  exit 1
fi

echo "Blender: $BLENDER"
for view in overview aisle bay; do
  OUT="$OUTDIR/$NAME.$view.png"
  echo "— рендер $view → $OUT"
  "$BLENDER" --background --python "$HERE/blender_from_kp.py" -- "$SCENE" "$OUT" "$view" \
    | grep -E '^\[RAX\]|Error|Traceback' || true
done
echo "Готово. Кадры лежат в $OUTDIR"
