import os
import shutil
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
RENDER_DIR = os.path.join(PROJECT_DIR, "drone_assets", "renders")
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public", "drone")
os.makedirs(PUBLIC_DIR, exist_ok=True)

# Copy all non-propeller renders
for fname in os.listdir(RENDER_DIR):
    if fname.endswith(".png") and not fname.startswith("drone_prop_") and not fname.startswith("test_"):
        shutil.copy2(os.path.join(RENDER_DIR, fname), os.path.join(PUBLIC_DIR, fname))
        print(f"Copied {fname} to public/drone/")

# Hub coordinates on 1400x900 canvas
HUBS = {
    "drone_prop_fl": (1198.78, 445.85),
    "drone_prop_fr": (900.57, 626.75),
    "drone_prop_rl": (573.44, 267.89),
    "drone_prop_rr": (248.20, 371.28),
}

HALF_SIZE = 180  # 360x360 square

for prop_name, (cx, cy) in HUBS.items():
    src_path = os.path.join(RENDER_DIR, f"{prop_name}.png")
    if os.path.exists(src_path):
        im = Image.open(src_path)
        left = int(round(cx - HALF_SIZE))
        top = int(round(cy - HALF_SIZE))
        right = left + HALF_SIZE * 2
        bottom = top + HALF_SIZE * 2
        
        cropped = im.crop((left, top, right, bottom))
        dst_path = os.path.join(PUBLIC_DIR, f"{prop_name}.png")
        cropped.save(dst_path)
        print(f"Cropped {prop_name}.png to 360x360 (hub at 180,180) -> {dst_path}")

print("Propeller processing complete!")
