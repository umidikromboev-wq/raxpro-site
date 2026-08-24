"""
Blender-сцена склада RaxPro. Читает те же числа, что план, 3D и смета.
Запуск:
  Blender --background --python blender_scene.py -- out.png
"""
import bpy, sys, math, mathutils

# ---------------- те же данные, что в КП ----------------
P = dict(L=45.0, W=24.0, H=10.5, aisle=2.9, depth=1.1, gap=0.3, bay=2.7,
         pallets_per_bay=3, blocks=4, bays_per_row=16, levels=4,
         frameH=7.1, palletH=1.5)
rowX, x = [], P['gap']
for _ in range(P['blocks']):
    rowX += [x, x + P['depth']]
    x += 2 * P['depth'] + P['aisle']
SKIPS = {(1, 4), (2, 9), (3, 3), (4, 12), (6, 7), (7, 14)}
PITCH = P['frameH'] / P['levels']
AISLE_Z = (rowX[3] + P['depth'] + rowX[4]) / 2

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
out = args[0] if args else '/tmp/rax.png'
VIEW = args[1] if len(args) > 1 else 'aisle'

# ---------------- чистая сцена ----------------
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
M_FLOOR = mat('concrete', (0.30, 0.31, 0.32), 0.22, 0.0)
M_WALL = mat('panel', (0.72, 0.74, 0.76), 0.85, 0.0)
M_WOOD = mat('pallet_wood', (0.34, 0.21, 0.10), 0.88, 0.0)
M_LINE = mat('safety_line', (0.85, 0.62, 0.03), 0.5, 0.0)
M_BOX = [mat(f'box{i}', c, 0.92, 0.0) for i, c in enumerate(
    [(0.42, 0.27, 0.13), (0.36, 0.23, 0.11), (0.48, 0.33, 0.17)])]


def base_cube(name, sx, sy, sz, material):
    """Один mesh — дальше только объекты-ссылки, иначе 1800 паллет не соберутся."""
    me = bpy.data.meshes.new(name)
    bm_verts = [(-.5, -.5, 0), (.5, -.5, 0), (.5, .5, 0), (-.5, .5, 0),
                (-.5, -.5, 1), (.5, -.5, 1), (.5, .5, 1), (-.5, .5, 1)]
    faces = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
             (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    me.from_pydata([(v[0] * sx, v[1] * sy, v[2] * sz) for v in bm_verts], [], faces)
    me.update()
    me.materials.append(material)
    me.shade_flat()
    return me


def put(me, x, y, z, coll=None):
    o = bpy.data.objects.new(me.name, me)
    o.location = (x, y, z)
    (coll or scene.collection).objects.link(o)
    return o


# ---------------- пол, стены ----------------
floor_me = base_cube('floor', P['L'], P['W'], 0.05, M_FLOOR)
put(floor_me, P['L'] / 2, P['W'] / 2, -0.05)

wall_me_long = base_cube('wall_l', P['L'], 0.12, P['H'], M_WALL)
wall_me_short = base_cube('wall_s', 0.12, P['W'], P['H'], M_WALL)
put(wall_me_long, P['L'] / 2, -0.06, 0)
put(wall_me_long, P['L'] / 2, P['W'] + 0.06, 0)
put(wall_me_short, -0.06, P['W'] / 2, 0)
put(wall_me_short, P['L'] + 0.06, P['W'] / 2, 0)

# кровля и фермы
roof = base_cube('roof', P['L'], P['W'], 0.15, M_WALL)
put(roof, P['L'] / 2, P['W'] / 2, P['H'])
truss_me = base_cube('truss', 0.18, P['W'], 0.45, mat('truss', (0.22, 0.23, 0.25), 0.55, 0.6))
i = 0
while i * 4.5 <= P['L']:
    put(truss_me, i * 4.5, P['W'] / 2, P['H'] - 0.45)
    i += 1

# разметка проходов
line_me = base_cube('line', P['L'] - 2 * P['gap'], 0.10, 0.005, M_LINE)
for b in range(P['blocks']):
    y0 = rowX[b * 2 + 1] + P['depth']
    y1 = rowX[b * 2 + 2] if b < P['blocks'] - 1 else y0 + P['aisle']
    for z in (y0 + 0.12, y1 - 0.12):
        put(line_me, P['L'] / 2, z, 0.001)

# ---------------- стеллажи ----------------
bays = []
for ri, rz in enumerate(rowX):
    for b in range(P['bays_per_row']):
        if (ri, b) in SKIPS:
            continue
        bays.append((P['gap'] + b * P['bay'], rz))

upright_me = base_cube('upright', 0.105, 0.105, P['frameH'], M_STEEL)
brace_me = base_cube('brace', 0.05, P['depth'] - 0.16, 0.05, M_STEEL)
beam_me = base_cube('beam', P['bay'], 0.05, 0.12, M_BEAM)
pallet_me = base_cube('pallet', 0.80, 1.15, 0.14, M_WOOD)
box_mes = [base_cube(f'box{i}', 0.76, 1.08, 1.0, m) for i, m in enumerate(M_BOX)]

seen = set()
for (bx, bz) in bays:
    for px in (bx, bx + P['bay']):
        key = (round(px, 2), round(bz, 2))
        if key in seen:
            continue
        seen.add(key)
        for py in (bz + 0.07, bz + P['depth'] - 0.07):
            put(upright_me, px, py, 0)
        for k in range(1, 6):
            put(brace_me, px, bz + P['depth'] / 2, P['frameH'] * k / 6)

for (bx, bz) in bays:
    for lv in range(1, P['levels'] + 1):
        for py in (bz + 0.09, bz + P['depth'] - 0.09):
            put(beam_me, bx + P['bay'] / 2, py, lv * PITCH)

# ---------------- паллеты ----------------
n = 0
for (bx, bz) in bays:
    for lv in range(0, P['levels'] + 1):
        zz = 0.0 if lv == 0 else lv * PITCH + 0.06
        for k in range(P['pallets_per_bay']):
            if ((n * 2654435761) % 1000) / 1000 >= 0.72:
                n += 1
                continue
            px = bx + 0.18 + k * 0.88 + 0.4
            put(pallet_me, px, bz + P['depth'] / 2, zz)
            o = put(box_mes[n % 3], px, bz + P['depth'] / 2, zz + 0.14)
            o.scale = (1, 1, 0.85 + (n % 7) / 20)
            n += 1

# ---------------- свет ----------------
world = bpy.data.worlds.new('W')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (0.16, 0.18, 0.21, 1)
world.node_tree.nodes['Background'].inputs[1].default_value = 1.0
scene.world = world

for gx in range(4):
    for gz in range(3):
        ld = bpy.data.lights.new(f'hb{gx}{gz}', 'AREA')
        ld.energy = 9000
        ld.size = 2.2
        ld.color = (1.0, 0.96, 0.90)
        lo = bpy.data.objects.new(f'hb{gx}{gz}', ld)
        lo.location = (P['L'] * (gx + 0.5) / 4, P['W'] * (gz + 0.5) / 3, P['H'] - 0.7)
        scene.collection.objects.link(lo)

# ---------------- камера: тот же ракурс, что в Three.js ----------------
cd = bpy.data.cameras.new('cam')
cd.sensor_fit = 'VERTICAL'
cd.angle_y = math.radians(45)
cam = bpy.data.objects.new('cam', cd)
if VIEW == 'bay':
    # камера стоит В проходе и смотрит вдоль фасада соседнего ряда
    cam.location = mathutils.Vector((6.0, AISLE_Z - 0.9, 3.4))
    tgt = mathutils.Vector((17.5, rowX[4] + 0.2, 2.5))
else:                      # взгляд вдоль прохода
    tgt = mathutils.Vector((P['L'] * 0.42, AISLE_Z, 1.85))
    az, el, dist = 0.0, 0.055, 19.0
    cam.location = tgt + mathutils.Vector((dist * math.cos(el) * math.cos(az),
                                           dist * math.cos(el) * math.sin(az),
                                           dist * math.sin(el)))
d = tgt - cam.location
cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
scene.collection.objects.link(cam)
scene.camera = cam

# ---------------- рендер ----------------
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x, scene.render.resolution_y = 1216, 712
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = 0.9
ee = scene.eevee
ee.taa_render_samples = 64
try:
    ee.use_raytracing = True
    ee.ray_tracing_options.use_denoise = True
except Exception:
    pass
scene.render.filepath = out
scene.render.image_settings.file_format = 'PNG'
print(f'[RAX] объектов: {len(scene.collection.objects)}, секций: {len(bays)}, паллет: {n}')
bpy.ops.render.render(write_still=True)
print('[RAX] готово ->', out)
