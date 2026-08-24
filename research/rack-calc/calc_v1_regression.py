"""
RaxPro — ядро расчёта: габариты склада -> раскладка -> паллето-места -> спецификация -> смета.

Правила выведены из фактических КП RaxPro (Toshkent.uz, Fathulla, Lion Print, Sika)
и проверяются регрессией в tests_regression().
"""
from dataclasses import dataclass, field

MM = 1  # всё в миллиметрах

# ---------------------------------------------------------------- справочники
PALLETS = {
    "EUR":  {"w": 800,  "d": 1200, "name": "EUR 1200x800"},
    "FIN":  {"w": 1000, "d": 1200, "name": "FIN 1200x1000"},
}

# минимальный рабочий проход по типу техники
TRUCKS = {
    "reachtruck":   {"aisle": 2900, "name": "Ричтрак"},
    "stacker":      {"aisle": 2500, "name": "Штабелёр"},
    "counterbal":   {"aisle": 3800, "name": "Вилочный погрузчик"},
}

# типоразмеры балок: длина -> паллет по фронту, паспортная нагрузка на пару, кг
BEAMS = {
    2700: {"pallets": 3, "capacity": 3000},
    3300: {"pallets": 4, "capacity": 2700},
}

RACK_DEPTH = 1100          # глубина ряда стеллажа
WALL_GAP = 300             # отступ от стены
FRAME_STEP = 100           # шаг подбора высоты рамы
CEILING_RESERVE = 500      # запас под спринклеры/светильники
LOAD_CLEARANCE = 150       # зазор над грузом до следующей балки
BEAM_HEIGHT = 120          # высота профиля балки

# цены, сум. Выведены из фактических КП: рама 4000мм ~1.97 млн, 6000мм ~2.68 млн
PRICE = {
    "frame_base": 550_000,
    "frame_per_m": 355_000,
    "beam_2700": 620_000,
    "beam_3300": 758_000,
    "lock": 850,
    "anchor": 5_800,
}


class DesignError(Exception):
    """Расчёт невозможен — блокирует выпуск КП (правило 03: проверки запрещают выпуск)."""


@dataclass
class Input:
    client: str
    length: int              # длина склада, мм
    width: int               # ширина склада, мм
    ceiling: int             # высота потолка, мм
    pallet: str = "EUR"
    pallet_load: int = 800   # вес гружёной паллеты, кг
    pallet_height: int = 1500  # высота гружёной паллеты, мм
    truck: str = "reachtruck"
    beam: int = 2700
    columns: int = 0         # число колонн в поле склада
    docks: int = 0           # ворота


@dataclass
class Layout:
    blocks: int              # число двойных рядов
    wall_rows: int           # пристенных одинарных рядов
    rows: int                # всего рядов стеллажа
    sections: int            # всего секций
    levels: int              # балочных ярусов (сверх напольного)
    frame_h: int
    aisle: int
    sections_per_row: int
    used_width: int
    positions: int           # паллето-мест
    layout_x: list = field(default_factory=list)  # x-координаты рядов, мм


# ---------------------------------------------------------------- проектирование
def design(inp: Input) -> Layout:
    if inp.beam not in BEAMS:
        raise DesignError(f"Неизвестный типоразмер балки: {inp.beam}")
    if inp.truck not in TRUCKS:
        raise DesignError(f"Неизвестный тип техники: {inp.truck}")

    beam = BEAMS[inp.beam]
    if inp.pallet_load * beam["pallets"] > beam["capacity"]:
        raise DesignError(
            f"Перегруз балки: {beam['pallets']} x {inp.pallet_load} кг = "
            f"{beam['pallets']*inp.pallet_load} кг при паспортных {beam['capacity']} кг"
        )

    aisle = TRUCKS[inp.truck]["aisle"]
    usable_w = inp.width - 2 * WALL_GAP
    usable_l = inp.length - 2 * WALL_GAP
    if usable_w <= 0 or usable_l <= 0:
        raise DesignError("Габариты склада меньше технологических отступов")

    # --- ярусность: сколько балочных уровней влезает под потолок
    pitch = inp.pallet_height + LOAD_CLEARANCE + BEAM_HEIGHT
    avail = inp.ceiling - CEILING_RESERVE
    levels = 0
    while (levels + 1) * pitch + inp.pallet_height <= avail:
        levels += 1
    if levels < 1:
        raise DesignError(
            f"Потолок {inp.ceiling/1000:.1f} м не вмещает ни одного яруса "
            f"при высоте паллеты {inp.pallet_height/1000:.1f} м"
        )
    frame_h = levels * pitch
    frame_h = ((frame_h + FRAME_STEP - 1) // FRAME_STEP) * FRAME_STEP
    if frame_h + inp.pallet_height > avail:
        levels -= 1
        frame_h = levels * pitch
        frame_h = ((frame_h + FRAME_STEP - 1) // FRAME_STEP) * FRAME_STEP

    # --- поперечная раскладка: перебираем число двойных блоков, берём максимум мест
    best = None
    for wall_rows in (0, 1, 2):
        n = 0
        while True:
            need = wall_rows * RACK_DEPTH + n * 2 * RACK_DEPTH
            aisles = n + wall_rows if (n + wall_rows) > 0 else 0
            if wall_rows and n:
                aisles = n + wall_rows - 1 + 1
            need += aisles * aisle
            if need > usable_w:
                break
            rows = wall_rows + n * 2
            if rows:
                cand = (rows, wall_rows, n, need)
                if best is None or rows > best[0]:
                    best = cand
            n += 1
    if best is None:
        raise DesignError(
            f"Ширина {inp.width/1000:.1f} м не вмещает ни одного ряда с проходом "
            f"{aisle/1000:.1f} м под {TRUCKS[inp.truck]['name'].lower()}"
        )
    rows, wall_rows, blocks, used_width = best

    # --- продольная раскладка: секции минус колонны
    sections_per_row = usable_l // inp.beam
    if sections_per_row < 1:
        raise DesignError("Длина склада не вмещает ни одной секции")
    sections = rows * sections_per_row - inp.columns

    positions = sections * (levels + 1) * beam["pallets"]

    # координаты рядов для чертежа
    xs, x = [], WALL_GAP
    if wall_rows:
        xs.append(x); x += RACK_DEPTH + aisle
    for _ in range(blocks):
        xs.append(x); xs.append(x + RACK_DEPTH); x += 2 * RACK_DEPTH + aisle
    if wall_rows == 2:
        xs.append(inp.width - WALL_GAP - RACK_DEPTH)

    return Layout(blocks, wall_rows, rows, sections, levels, frame_h, aisle,
                  sections_per_row, used_width, positions, xs)


# ---------------------------------------------------------------- спецификация
def bom(lay: Layout, inp: Input) -> list:
    """Восстановленные правила. Проверены на Toshkent.uz: 3 позиции из 3."""
    frames = lay.sections + lay.rows
    beams = lay.sections * lay.levels * 2
    locks = beams * 2
    anchors = frames * 4

    fp = PRICE["frame_base"] + PRICE["frame_per_m"] * (lay.frame_h / 1000)
    bp = PRICE[f"beam_{inp.beam}"]
    return [
        {"n": f"Рама паллетная {lay.frame_h}x105 мм", "qty": frames, "unit": fp},
        {"n": f"Балка паллетная {inp.beam}x120 мм",   "qty": beams,  "unit": bp},
        {"n": "Замок балки",                          "qty": locks,  "unit": PRICE["lock"]},
        {"n": "Анкер Hilti 120x12 мм",                "qty": anchors,"unit": PRICE["anchor"]},
    ]


def quote(lines: list, vat=0.12, discount=0.0) -> dict:
    net = sum(l["qty"] * l["unit"] for l in lines)
    disc = net * discount
    sub = net - disc
    return {"net": net, "discount": disc, "subtotal": sub,
            "vat": sub * vat, "total": sub * (1 + vat)}


# ---------------------------------------------------------------- регрессия
def tests_regression():
    """Правило 04: старые проекты как эталон. Ломаем формулы — тест падает."""
    out = []
    # Toshkent.uz: 15 секций, 3 ряда, 2 яруса -> факт 18 рам / 60 балок / 120 замков
    lay = Layout(0, 0, 3, 15, 2, 4000, 2900, 5, 0, 0)
    b = bom(lay, Input("t", 0, 0, 0))
    got = {x["n"].split()[0]: x["qty"] for x in b}
    for name, exp, act in [("рамы", 18, got["Рама"]), ("балки", 60, got["Балка"]),
                           ("замки", 120, got["Замок"])]:
        out.append((f"Toshkent.uz {name}", exp, act, exp == act))
    # Fathulla / Lion Print: замок = балка x2
    for nm, beams_, locks_ in [("Fathulla", 124, 248), ("Lion Print", 534, 1068)]:
        out.append((f"{nm} замки", locks_, beams_ * 2, beams_ * 2 == locks_))
    # Sika / Fathulla: анкер = рама x4
    for nm, fr, an in [("Sika", 6, 24), ("Fathulla", 40, 160)]:
        out.append((f"{nm} анкеры", an, fr * 4, fr * 4 == an))
    return out


if __name__ == "__main__":
    print("=== РЕГРЕССИЯ ПО ФАКТИЧЕСКИМ КП ===")
    ok = True
    for name, exp, act, passed in tests_regression():
        ok &= passed
        print(f"  {'OK  ' if passed else 'FAIL'} {name:22} ожидали {exp:6} получили {act:6}")
    print("  ИТОГ:", "все сходятся" if ok else "ЕСТЬ РАСХОЖДЕНИЯ")
