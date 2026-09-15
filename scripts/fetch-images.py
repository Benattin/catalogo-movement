"""Download JPGs from the original catalog and write WebP to public/img/."""
from io import BytesIO
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img"
OUT.mkdir(parents=True, exist_ok=True)
BASE = "https://catalogomovement.netlify.app/img/movement/"

FILES = [
    "bermuda4.jpg",
    "bermuda5.jpg",
    "blusamoletomcinza.jpg",
    "blusamoletomazul.jpg",
    "blusamoletomoff.jpg",
    "blusamoletompreta.jpg",
    "calçaestampada.jpg",
    "calçalisa3.jpg",
    "calçamoletomcinza.jpg",
    "calçamoletomazul.jpg",
    "calçamoletomoff.jpg",
    "calçamoletompreta.jpg",
    "camisetaboxy.jpg",
    "camisetaboxy2.jpg",
    "camisetaboxy4.jpg",
    "camisetaboxy5.jpg",
    "toucapreta.jpg",
    "toucabege.jpg",
    "toucachocolate.jpg",
]


def fetch(name: str) -> bytes:
    url = BASE + quote(name)
    req = Request(url, headers={"User-Agent": "catalogo-movement-build"})
    with urlopen(req, timeout=60) as r:
        data = r.read()
        ctype = r.headers.get_content_type()
    if not ctype.startswith("image/"):
        raise RuntimeError(f"{name}: not an image ({ctype})")
    return data


def ascii_name(name: str) -> str:
    return name.replace("ç", "c").replace("Ç", "C")


def to_webp(data: bytes, dest: Path, max_w: int = 1200) -> None:
    im = Image.open(BytesIO(data)).convert("RGB")
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.Resampling.LANCZOS)
    im.save(dest, "WEBP", quality=76, method=6)


def placeholder(title: str, dest: Path) -> None:
    w, h = 900, 1125
    im = Image.new("RGB", (w, h), (246, 243, 236))
    d = ImageDraw.Draw(im)
    d.rectangle((40, 40, w - 40, h - 40), outline=(196, 165, 116), width=2)
    font_path = Path(r"C:\Windows\Fonts\georgia.ttf")
    font = (
        ImageFont.truetype(str(font_path), 36) if font_path.exists() else ImageFont.load_default()
    )
    lines = title.upper().split("\n")
    y = h // 2 - 28 * len(lines)
    for line in lines:
        tw = d.textlength(line, font=font)
        d.text(((w - tw) / 2, y), line, fill=(18, 17, 15), font=font)
        y += 52
    im.save(dest, "WEBP", quality=80, method=6)


def main() -> None:
    for name in FILES:
        dest = OUT / (Path(ascii_name(name)).stem + ".webp")
        print("fetch", name)
        to_webp(fetch(name), dest)
        print(" ", dest.name, dest.stat().st_size)
    placeholder("Believe Always\nOff White\nFoto no WhatsApp", OUT / "believe-off.webp")
    placeholder("Believe Always\nPreta\nFoto no WhatsApp", OUT / "believe-preta.webp")
    print("done", len(list(OUT.glob("*.webp"))), "webp")


if __name__ == "__main__":
    main()
