"""
Фотореалистичный рендер склада по сцене, выгруженной генератором КП.

Раньше числа для Blender были зашиты в скрипт, и рендер жил отдельно от
расчёта: картинка показывала один склад, а смета считала другой. Теперь
скрипт читает тот же JSON, из которого построены план, спецификация и
трёхмерная модель в браузере — расхождение невозможно по устройству.

Выгрузка: кнопка «Сцена для Blender» в raxpro.uz/kp
Запуск:
    blender --background --python blender_from_kp.py -- scene.json out.png [ракурс]

Ракурсы: overview (по умолчанию) · aisle — взгляд вдоль прохода · bay — фасад ряда.
Blender в системе не стоит; бинарник запускается со смонтированного образа:
    /Volumes/Blender/Blender.app/Contents/MacOS/Blender
"""
import bpy
import json
import math
import sys

import mathutils

MM = 0.001

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
if not args:
    raise SystemExit('Нужен путь к JSON-сцене: blender ... -- scene.json out.png [ракурс]')
scene_path = args[0]
out = args[1] if len(args) > 1 else '/tmp/rax.png'
view = args[2] if len(args) > 2 else 'overview'

with open(scene_path, encoding='utf-8') as fh:
    S = json.load(fh)

room = S['room']
layout = S['layout']

L = room['width'] * MM
W = room['depth'] * MM
H = room['ceiling'] * MM
BAY = room['beam'] * MM
DEPTH = room['rackDepth'] * MM
FRAME_H = layout['frameHeight'] * MM
LEVELS = int(layout['levels'])
PITCH = FRAME_H / LEVELS
BAYS = [(b['x'] * MM, b['y'] * MM) for b in layout['bays']]
PER_BAY = max(1, round(layout['positions'] / (len(BAYS) * (LEVELS + 1)))) if BAYS else 3
STEP = BAY / PER_BAY

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def mat(name, color, rough=0.6, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    return m


M_STEEL = mat('steel_blue', (0.035, 0.10, 0.34), 0.34, 0.75)
M_BEAM = mat('beam_orange', (0.80, 0.20, 0.015), 0.36, 0.70)
M_FLOOR = mat('concrete', (0.30, 0.31, 0.32), 0.22)
M_WALL = mat('panel', (0.72, 0.74, 0.76), 0.85)
M_COLUMN = mat('column', (0.66, 0.68, 0.70), 0.9)
M_WOOD = mat('pallet_wood', (0.34, 0.21, 0.10), 0.88)
M_LINE = mat('safety_line', (0.85, 0.62, 0.03), 0.5)
M_BOX = [mat(f'box{i}', c, 0.92) for i, c in enumerate(
    [(0.52, 0.36, 0.19), (0.44, 0.30, 0.15), (0.60, 0.44, 0.25)])]


def base_cube(name, sx, sy, sz, material):
    """Один mesh на тип детали — дальше только объекты-ссылки.
    Иначе полторы тысячи паллет собираются минутами и едят память."""
    me = bpy.data.meshes.new(name)
    verts = [(-.5, -.5, 0), (.5, -.5, 0), (.5, .5, 0), (-.5, .5, 0),
             (-.5, -.5, 1), (.5, -.5, 1), (.5, .5, 1), (-.5, .5, 1)]
    faces = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
             (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    me.from_pydata([(v[0] * sx, v[1] * sy, v[2] * sz) for v in verts], [], faces)
    me.update()
    me.materials.append(material)
    me.shade_flat()
    return me


def put(me, x, y, z):
    o = bpy.data.objects.new(me.name, me)
    o.location = (x, y, z)
    scene.collection.objects.link(o)
    return o


# ——— коробка здания
# Общий вид снимается снаружи, поэтому крышу и две ближние к камере стены
# не строим: иначе в кадре закрытый ящик, а не расстановка.
OPEN = view == 'overview'

put(base_cube('floor', L, W, 0.05, M_FLOOR), L / 2, W / 2, -0.05)
wall_long = base_cube('wall_l', L, 0.12, H, M_WALL)
wall_short = base_cube('wall_s', 0.12, W, H, M_WALL)
if not OPEN:
    put(wall_long, L / 2, -0.06, 0)
    put(wall_short, L + 0.06, W / 2, 0)
put(wall_long, L / 2, W + 0.06, 0)
put(wall_short, -0.06, W / 2, 0)
if not OPEN:
    put(base_cube('roof', L, W, 0.15, M_WALL), L / 2, W / 2, H)

    truss = base_cube('truss', 0.18, W, 0.45, mat('truss', (0.22, 0.23, 0.25), 0.55, 0.6))
    i = 0
    while i * 4.5 <= L:
        put(truss, i * 4.5, W / 2, H - 0.45)
        i += 1

# ——— колонны здания: те же, что обходила раскладка
for c in room.get('columns') or []:
    size = c['size'] * MM
    put(base_cube(f"col{c['x']}_{c['y']}", size, size, H, M_COLUMN), c['x'] * MM, c['y'] * MM, 0)

# ——— стеллажи
upright = base_cube('upright', 0.105, 0.105, FRAME_H, M_STEEL)
brace = base_cube('brace', 0.05, max(DEPTH - 0.16, 0.08), 0.05, M_STEEL)
beam = base_cube('beam', BAY, 0.05, 0.12, M_BEAM)
pallet = base_cube('pallet', STEP * 0.9, DEPTH * 0.9, 0.14, M_WOOD)
boxes = [base_cube(f'box{i}', STEP * 0.86, DEPTH * 0.84, 1.0, m) for i, m in enumerate(M_BOX)]

seen = set()
for bx, bz in BAYS:
    for px in (bx, bx + BAY):
        key = (round(px, 3), round(bz, 3))
        if key in seen:
            continue
        seen.add(key)
        for py in (bz + 0.07, bz + DEPTH - 0.07):
            put(upright, px, py, 0)
        for k in range(1, 6):
            put(brace, px, bz + DEPTH / 2, FRAME_H * k / 6)

for bx, bz in BAYS:
    for lv in range(1, LEVELS + 1):
        for py in (bz + 0.09, bz + DEPTH - 0.09):
            put(beam, bx + BAY / 2, py, lv * PITCH)

# ——— груз: заполнение 55 %, тот же детерминированный отбор, что в браузере
n = 0
placed = 0
for bx, bz in BAYS:
    for lv in range(0, LEVELS + 1):
        zz = 0.0 if lv == 0 else lv * PITCH + 0.06
        for k in range(PER_BAY):
            if ((n * 2654435761) % 1000) / 1000 >= 0.55:
                n += 1
                continue
            px = bx + STEP * (k + 0.5)
            put(pallet, px, bz + DEPTH / 2, zz)
            o = put(boxes[n % 3], px, bz + DEPTH / 2, zz + 0.14)
            o.scale = (1, 1, 0.85 + (n % 7) / 20)
            n += 1
            placed += 1

# ——— свет: сетка потолочных светильников по площади помещения
world = bpy.data.worlds.new('W')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (0.16, 0.18, 0.21, 1)
world.node_tree.nodes['Background'].inputs[1].default_value = 1.0
scene.world = world

nx = max(2, int(L // 12))
ny = max(2, int(W // 10))
cell_area = (L / nx) * (W / ny)
# Мощность считается от площади, которую светильник накрывает, и от высоты
# подвеса: зашитые 9000 Вт были подобраны под склад 45×24×10,5 и в меньшем
# помещении давали пересвет на две ступени.
energy = max(900.0, 42.0 * cell_area * (H / 10.5))

for gx in range(nx):
    for gz in range(ny):
        ld = bpy.data.lights.new(f'hb{gx}{gz}', 'AREA')
        ld.energy = energy
        ld.size = 3.6   # мягче: маленький источник выжигает верхний ярус
        ld.color = (1.0, 0.96, 0.90)
        lo = bpy.data.objects.new(f'hb{gx}{gz}', ld)
        lo.location = (L * (gx + 0.5) / nx, W * (gz + 0.5) / ny, H - 0.7)
        scene.collection.objects.link(lo)

# ——— камера
rows_y = sorted({round(bz, 3) for _, bz in BAYS})
aisle_y = W / 2
for a, b in zip(rows_y, rows_y[1:]):
    if b - (a + DEPTH) > DEPTH:      # первый настоящий проход, а не спарка рядов
        aisle_y = (a + DEPTH + b) / 2
        break

cd = bpy.data.cameras.new('cam')
cd.sensor_fit = 'VERTICAL'
cd.angle_y = math.radians(45)
cam = bpy.data.objects.new('cam', cd)

if view == 'aisle':
    tgt = mathutils.Vector((L * 0.42, aisle_y, 1.85))
    az, el, dist = 0.0, 0.055, min(19.0, L * 0.45)
elif view == 'bay':
    tgt = mathutils.Vector((L * 0.38, aisle_y + DEPTH, 2.5))
    az, el, dist = -0.9, 0.12, 12.0
else:
    tgt = mathutils.Vector((L / 2, W / 2, FRAME_H * 0.35))
    az, el = -0.72, 0.34
    dist = (max(L, W) / 2) / math.tan(math.radians(22.5)) * 0.95

cam.location = tgt + mathutils.Vector((
    dist * math.cos(el) * math.cos(az),
    dist * math.cos(el) * math.sin(az),
    dist * math.sin(el),
))
direction = tgt - cam.location
cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
scene.collection.objects.link(cam)
scene.camera = cam

# ——— рендер
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x, scene.render.resolution_y = 1600, 900
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = 0.0
ee = scene.eevee
ee.taa_render_samples = 64
try:
    ee.use_raytracing = True
    ee.ray_tracing_options.use_denoise = True
except Exception:
    pass
scene.render.filepath = out
scene.render.image_settings.file_format = 'PNG'

print(f"[RAX] свет {nx}×{ny} по {energy:.0f} Вт")
print(f"[RAX] {S.get('number', '')} · секций {len(BAYS)} · ярусов {LEVELS} · "
      f"паллет {placed} · объектов {len(scene.collection.objects)}")
bpy.ops.render.render(write_still=True)
print('[RAX] готово ->', out)
