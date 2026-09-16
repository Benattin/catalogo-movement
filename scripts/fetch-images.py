"""Gera WebP a partir de fotos já em public/img/. Não baixa o site antigo."""
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img"
OUT.mkdir(parents=True, exist_ok=True)
MAX_W = 1200


def to_webp(src: Path, dest: Path) -> None:
    im = Image.open(src).convert("RGB")
    if im.width > MAX_W:
        h = round(im.height * MAX_W / im.width)
        im = im.resize((MAX_W, h), Image.Resampling.LANCZOS)
    im.save(dest, "WEBP", quality=76, method=6)


def main() -> None:
    n = 0
    for src in sorted(OUT.iterdir()):
        if src.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        dest = src.with_suffix(".webp")
        to_webp(src, dest)
        print(" ", dest.name, dest.stat().st_size)
        n += 1
    print("done", n, "webp from local files")


if __name__ == "__main__":
    main()
