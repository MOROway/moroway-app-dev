# Combine screenshots into a labelled contact sheet (2 columns).
# usage: python3 -I sheet.py <out.png> <x0,y0,x1,y1 crop box> <scale> <image> [<image> ...]
import sys

from PIL import Image, ImageDraw

out, box, scale, *images = sys.argv[1:]
box = tuple(int(v) for v in box.split(","))
scale = float(scale)
tiles = []
for path in images:
    tile = Image.open(path).convert("RGB").crop(box)
    tile = tile.resize((int(tile.width * scale), int(tile.height * scale)))
    ImageDraw.Draw(tile).text((4, 4), path.rsplit("/", 1)[-1], fill=(255, 255, 0))
    tiles.append(tile)
width, height = tiles[0].size
columns = 2
rows = (len(tiles) + columns - 1) // columns
sheet = Image.new("RGB", (width * columns, height * rows), (40, 40, 40))
for k, tile in enumerate(tiles):
    sheet.paste(tile, ((k % columns) * width, (k // columns) * height))
sheet.save(out)
