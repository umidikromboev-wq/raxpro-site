#!/usr/bin/env python3
"""Визуальная приёмка PDF: склеивает страницы по 4 на лист, чтобы просмотреть глазами.

    python3 verify.py КП.pdf /tmp/qa        # все страницы
    python3 verify.py КП.pdf /tmp/qa 6 13   # только 6-я и 13-я (нумерация с 1)

Зачем: .page{overflow:hidden} режет переполнение МОЛЧА. В HTML всё выглядит нормально,
а в PDF низ страницы просто исчезает. Ловится только просмотром отрендеренных страниц.
В системе нет pdftoppm/pdftocairo/mutool/gs — поэтому PyMuPDF.
    pip3 install pymupdf pillow
"""
import sys, io, os
import fitz
from PIL import Image

pdf  = sys.argv[1]
out  = sys.argv[2] if len(sys.argv) > 2 else '/tmp/kp-qa'
only = [int(x) - 1 for x in sys.argv[3:]]

os.makedirs(out, exist_ok=True)
doc = fitz.open(pdf)
print(f'страниц: {doc.page_count}')

idx = only if only else list(range(doc.page_count))
imgs = {i: Image.open(io.BytesIO(doc[i].get_pixmap(dpi=96).tobytes('png'))) for i in idx}
w, h = next(iter(imgs.values())).size

for g in range(0, len(idx), 4):
    chunk = idx[g:g + 4]
    sheet = Image.new('RGB', (w * len(chunk) + 10 * len(chunk), h), (120, 120, 124))
    for i, n in enumerate(chunk):
        sheet.paste(imgs[n], (i * (w + 10), 0))
    f = f'{out}/sheet{g//4}.jpg'
    sheet.save(f, quality=84)
    print(f, '→ стр.', ', '.join(str(n + 1) for n in chunk))
