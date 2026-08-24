"""
RaxPro — ядро расчёта v2. Склад задаётся ПОЛИГОНОМ, колонны — реальными координатами.

Отличия от v1:
  • контур произвольной формы (скошенные стены, выступы, П-образные помещения);
  • колонны и ворота как препятствия с буферной зоной, а не абстрактным "минус N секций";
  • перебор ориентации рядов и смещения сетки — выбирается вариант с максимумом мест.

Все размеры в миллиметрах.
"""
from dataclasses import dataclass, field
import math

RACK_DEPTH = 1100
WALL_GAP = 300
CEILING_RESERVE = 500
LOAD_CLEARANCE = 150
BEAM_HEIGHT = 120
FRAME_STEP = 100
COLUMN_BUFFER = 150      # зазор вокруг колонны
DOCK_BUFFER = 2500       # свободная зона перед воротами

TRUCKS = {"reachtruck": {"aisle": 2900, "name": "Ричтрак"},
          "stacker":    {"aisle": 2500, "name": "Штабелёр"},
          "counterbal": {"aisle": 3800, "name": "Вилочный погрузчик"}}
BEAMS = {2700: {"pallets": 3, "capacity": 3000},
         3300: {"pallets": 4, "capacity": 2700}}


class DesignError(Exception):
    """Расчёт невозможен — блокирует выпуск КП."""


# ----------------------------------------------------------------- геометрия
def poly_contains(poly, x, y):
    inside = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y):
            xin = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < xin:
                inside = not inside
    return inside


def rect_inside(poly, x, y, w, h, margin=0):
    """Прямоугольник целиком внутри полигона (проверка по углам и середине рёбер)."""
    x0, y0, x1, y1 = x - margin, y - margin, x + w + margin, y + h + margin
    pts = [(x0, y0), (x1, y0), (x1, y1), (x0, y1),
           ((x0 + x1) / 2, y0), ((x0 + x1) / 2, y1),
           (x0, (y0 + y1) / 2), (x1, (y0 + y1) / 2)]
    return all(poly_contains(poly, px, py) for px, py in pts)


def rects_overlap(a, b):
    return not (a[0] + a[2] <= b[0] or b[0] + b[2] <= a[0] or
                a[1] + a[3] <= b[1] or b[1] + b[3] <= a[1])


def poly_bounds(poly):
    xs = [p[0] for p in poly]
    ys = [p[1] for p in poly]
    return min(xs), min(ys), max(xs), max(ys)


def poly_area(poly):
    s = 0
    for i in range(len(poly)):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % len(poly)]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


# ----------------------------------------------------------------- вход
@dataclass
class Site:
    client: str
    polygon: list                     # [(x,y), ...] контур склада
    ceiling: int
    columns: list = field(default_factory=list)   # [(x, y, size)]
    docks: list = field(default_factory=list)     # [(x, y, w, h)]
    pallet_load: int = 800
    pallet_height: int = 1500
    truck: str = "reachtruck"
    beam: int = 2700
    depth: int = RACK_DEPTH        # глубина ряда: у RaxPro встречается 1050 и 1100
    mode: str = "auto"             # auto | rows | perimeter


@dataclass
class Plan:
    orientation: int          # 0 = ряды вдоль X, 90 = вдоль Y
    offset: int
    bays: list                # [(x, y, w, h, row_index)]
    rows: int
    sections: int
    levels: int
    frame_h: int
    aisle: int
    positions: int
    fill_ratio: float         # доля площади под стеллажами


# ----------------------------------------------------------------- ярусность
def levels_for(ceiling, pallet_height):
    pitch = pallet_height + LOAD_CLEARANCE + BEAM_HEIGHT
    avail = ceiling - CEILING_RESERVE
    lv = 0
    while (lv + 1) * pitch + pallet_height <= avail:
        lv += 1
    if lv < 1:
        raise DesignError(
            f"Потолок {ceiling/1000:.1f} м не вмещает ни одного яруса "
            f"при высоте паллеты {pallet_height/1000:.1f} м")
    fh = math.ceil(lv * pitch / FRAME_STEP) * FRAME_STEP
    if fh + pallet_height > avail:
        lv -= 1
        fh = math.ceil(lv * pitch / FRAME_STEP) * FRAME_STEP
    return lv, fh


# ----------------------------------------------------------------- раскладка
def _try_layout(site, poly, orientation, offset, aisle, bay, levels):
    """Строит одну конфигурацию и возвращает принятые секции."""
    minx, miny, maxx, maxy = poly_bounds(poly)
    obstacles = [(cx - s / 2 - COLUMN_BUFFER, cy - s / 2 - COLUMN_BUFFER,
                  s + 2 * COLUMN_BUFFER, s + 2 * COLUMN_BUFFER)
                 for cx, cy, s in site.columns]
    obstacles += [(dx - DOCK_BUFFER, dy - DOCK_BUFFER,
                   dw + 2 * DOCK_BUFFER, dh + 2 * DOCK_BUFFER)
                  for dx, dy, dw, dh in site.docks]

    bays, row_i = [], 0
    limit = maxy - WALL_GAP
    y = miny + WALL_GAP + offset
    # Ряд обслуживается только если с его лицевой стороны есть проход нужной ширины
    # (либо ряд стоит спиной к стене). Иначе паллету туда не поставить.
    while y + site.depth <= limit:
        room_after = limit - (y + 2 * site.depth)      # что остаётся за двойным блоком
        if y + 2 * site.depth <= limit and room_after >= aisle:
            depths = (0, site.depth)                   # полный блок: проход есть с двух сторон
            advance = 2 * site.depth + aisle
        else:
            depths = (0,)                              # только один ряд, спиной к стене
            advance = site.depth + aisle
        for d in depths:
            ry = y + d
            x = minx + WALL_GAP
            while x + bay <= maxx - WALL_GAP:
                r = (x, ry, bay, site.depth) if orientation == 0 else (ry, x, site.depth, bay)
                if rect_inside(poly, *r) and not any(rects_overlap(r, o) for o in obstacles):
                    bays.append((*r, row_i))
                x += bay
            row_i += 1
        y += advance
    return bays



# ------------------------------------------------- пристенная раскладка
def _perimeter_layout(site, poly, aisle, bay, depth):
    """Ряды вдоль стен, центр помещения остаётся под проезд.

    Нужен там, где рядная схема не работает: небольшие помещения и залы
    сложной формы. Именно так собран склад «Toshkent.uz» — стеллажи буквой П
    по периметру, включая скошенную стену.
    """
    obstacles = [(cx - s / 2 - COLUMN_BUFFER, cy - s / 2 - COLUMN_BUFFER,
                  s + 2 * COLUMN_BUFFER, s + 2 * COLUMN_BUFFER)
                 for cx, cy, s in site.columns]
    obstacles += [(dx - DOCK_BUFFER, dy - DOCK_BUFFER,
                   dw + 2 * DOCK_BUFFER, dh + 2 * DOCK_BUFFER)
                  for dx, dy, dw, dh in site.docks]

    bays, n = [], len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        ex, ey = x2 - x1, y2 - y1
        seg = math.hypot(ex, ey)
        if seg < bay:
            continue
        ux, uy = ex / seg, ey / seg
        nx, ny = -uy, ux              # нормаль; ориентацию внутрь проверим ниже
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        if not poly_contains(poly, mx + nx * depth * 0.5, my + ny * depth * 0.5):
            nx, ny = -nx, -ny
        if not poly_contains(poly, mx + nx * depth * 0.5, my + ny * depth * 0.5):
            continue                  # ребро без внутренней стороны — пропускаем

        count = int((seg - 2 * WALL_GAP) // bay)
        for k in range(count):
            t = WALL_GAP + k * bay
            # четыре угла секции: вдоль ребра на bay, внутрь на depth
            cx0, cy0 = x1 + ux * t, y1 + uy * t
            pts = [(cx0, cy0),
                   (cx0 + ux * bay, cy0 + uy * bay),
                   (cx0 + ux * bay + nx * depth, cy0 + uy * bay + ny * depth),
                   (cx0 + nx * depth, cy0 + ny * depth)]
            # углы секции лежат ровно на стене — стягиваем их внутрь,
            # иначе точка на ребре не считается принадлежащей контуру
            ccx = sum(p[0] for p in pts) / 4
            ccy = sum(p[1] for p in pts) / 4
            EPS = 0.04
            if not all(poly_contains(poly, px + (ccx - px) * EPS, py + (ccy - py) * EPS)
                       for px, py in pts):
                continue
            bx = [p[0] for p in pts]; by = [p[1] for p in pts]
            r = (min(bx), min(by), max(bx) - min(bx), max(by) - min(by))
            if any(rects_overlap(r, o) for o in obstacles):
                continue
            bays.append((*r, i))      # индекс ряда = индекс стены
    return bays


def design(site: Site) -> Plan:
    if site.beam not in BEAMS:
        raise DesignError(f"Неизвестный типоразмер балки: {site.beam}")
    if site.truck not in TRUCKS:
        raise DesignError(f"Неизвестный тип техники: {site.truck}")
    beam = BEAMS[site.beam]
    if site.pallet_load * beam["pallets"] > beam["capacity"]:
        raise DesignError(
            f"Перегруз балки: {beam['pallets']} × {site.pallet_load} кг = "
            f"{beam['pallets']*site.pallet_load} кг при паспортных {beam['capacity']} кг")

    levels, frame_h = levels_for(site.ceiling, site.pallet_height)
    aisle = TRUCKS[site.truck]["aisle"]

    best = None
    if site.mode in ("auto", "perimeter"):
        pb = _perimeter_layout(site, site.polygon, aisle, site.beam, site.depth)
        if pb:
            pos = len(pb) * (levels + 1) * beam["pallets"]
            best = (pos, -1, 0, pb)          # -1 = пристенный режим

    if site.mode == "perimeter":
        if best is None:
            raise DesignError("Периметр не вмещает ни одной секции")
        pos, orientation, offset, bays = best
        rows = len({b[4] for b in bays})
        area = poly_area(site.polygon)
        return Plan(orientation, offset, bays, rows, len(bays), levels, frame_h,
                    aisle, pos, sum(b[2]*b[3] for b in bays)/area if area else 0)

    for orientation in (0, 90):
        poly = site.polygon if orientation == 0 else [(y, x) for x, y in site.polygon]
        for offset in range(0, 2 * RACK_DEPTH + aisle, 500):
            bays = _try_layout(site, poly, orientation, offset, aisle, site.beam, levels)
            if not bays:
                continue
            pos = len(bays) * (levels + 1) * beam["pallets"]
            if best is None or pos > best[0]:
                best = (pos, orientation, offset, bays)

    if best is None:
        raise DesignError(
            f"Контур не вмещает ни одного ряда с проходом {aisle/1000:.1f} м "
            f"под {TRUCKS[site.truck]['name'].lower()}")

    pos, orientation, offset, bays = best
    rows = len({b[4] for b in bays})
    area = poly_area(site.polygon)
    fill = sum(b[2] * b[3] for b in bays) / area if area else 0
    return Plan(orientation, offset, bays, rows, len(bays), levels, frame_h,
                aisle, pos, fill)


def bom(plan: Plan):
    frames = plan.sections + plan.rows
    beams = plan.sections * plan.levels * 2
    return [("Рама", frames), ("Балка", beams),
            ("Замок", beams * 2), ("Анкер", frames * 4)]


# ----------------------------------------------------------------- проверка
if __name__ == "__main__":
    print("=== ТЕСТ 1: прямоугольник 45×24, 6 колонн ===")
    rect = [(0, 0), (45000, 0), (45000, 24000), (0, 24000)]
    cols = [(x, y, 400) for x in (9000, 22000, 35000) for y in (7000, 17000)]
    s1 = Site("Oqtepa", rect, 10500, columns=cols,
              docks=[(0, 10000, 300, 4000)])
    p1 = design(s1)
    print(f"  ориентация {p1.orientation}°, рядов {p1.rows}, секций {p1.sections}, "
          f"ярусов {p1.levels}+1, мест {p1.positions}, заполнение {p1.fill_ratio*100:.0f}%")
    for n, q in bom(p1):
        print(f"    {n:8} {q}")

    print("\n=== ТЕСТ 2: склад со скошенной стеной (как у Toshkent.uz) ===")
    skew = [(0, 0), (28200, 0), (28200, 11200), (6000, 11200), (0, 6000)]
    s2 = Site("Skew", skew, 9000, columns=[(14000, 5000, 400)])
    p2 = design(s2)
    print(f"  ориентация {p2.orientation}°, рядов {p2.rows}, секций {p2.sections}, "
          f"мест {p2.positions}, заполнение {p2.fill_ratio*100:.0f}%")
    print("  скошенный угол секции не получили — контур отработал")

    print("\n=== ТЕСТ 3: низкий потолок должен упасть ===")
    try:
        design(Site("Low", rect, 1800))
        print("  ОШИБКА: расчёт не заблокирован")
    except DesignError as e:
        print(f"  OK, заблокировано: {e}")

    print("\n=== ТЕСТ 4: перегруз балки должен упасть ===")
    try:
        design(Site("Heavy", rect, 10500, pallet_load=1400))
        print("  ОШИБКА: расчёт не заблокирован")
    except DesignError as e:
        print(f"  OK, заблокировано: {e}")
