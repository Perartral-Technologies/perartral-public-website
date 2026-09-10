"""
generate_drone.py  –  V3 Correction Pass
=========================================
Industrial quadcopter UAV – assembled Blender model.

All arm assemblies use LOCAL coordinates parented to pivots.
Exploded metadata is stored as custom properties ONLY.
The default scene shows a fully assembled drone.
"""

# pyrefly: ignore [missing-import]
import bpy
import math
import os
# pyrefly: ignore [missing-import]
from mathutils import Vector, Matrix

# ---------------------------------------------------------------------------
# Output paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "drone_assets")
RENDER_DIR = os.path.join(OUTPUT_DIR, "renders")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(RENDER_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# Drone dimensions
# ---------------------------------------------------------------------------
BODY_LENGTH   = 4.5
BODY_WIDTH    = 2.0
BODY_HEIGHT   = 0.65

ARM_LENGTH    = 3.4
ARM_WIDTH     = 0.18
ARM_HEIGHT    = 0.16

MOTOR_RADIUS  = 0.24
MOTOR_DEPTH   = 0.24
PROP_LENGTH   = 1.6    # half-span per blade

# Arm attachment points on the body (body-relative)
FRONT_X       =  1.6
REAR_X        = -1.6
SIDE_Y        =  0.55

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)

def get_collection(name):
    col = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)
    return col

def move_to_col(obj, col):
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    col.objects.link(obj)

# ---------------------------------------------------------------------------
# Materials
# ---------------------------------------------------------------------------
def make_material(name, color, metallic=0.0, roughness=0.4):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return m

MAT_WHITE   = make_material("IndustrialWhite",   (0.72, 0.74, 0.73), 0.12, 0.32)
MAT_LOWER   = make_material("WarmGreyLower",     (0.22, 0.24, 0.25), 0.25, 0.34)
MAT_CARBON  = make_material("CarbonComposite",   (0.015, 0.02, 0.025), 0.35, 0.28)
MAT_BLACK   = make_material("MatteBlack",        (0.008, 0.01, 0.012), 0.04, 0.42)
MAT_METAL   = make_material("MachinedAluminium", (0.30, 0.32, 0.34), 0.88, 0.19)
MAT_PCB     = make_material("PCBGreen",          (0.015, 0.12, 0.055), 0.12, 0.33)
MAT_BATTERY = make_material("BatteryGraphite",   (0.04, 0.05, 0.055), 0.24, 0.31)
MAT_LENS    = make_material("OpticalGlass",      (0.005, 0.015, 0.025), 0.70, 0.07)
MAT_ACCENT  = make_material("SafetyGreen",       (0.03, 0.55, 0.28), 0.15, 0.27)
MAT_WIRE    = make_material("WireRed",           (0.20, 0.015, 0.01), 0.10, 0.35)

# ---------------------------------------------------------------------------
# Geometry primitives – all return the object; location is LOCAL
# ---------------------------------------------------------------------------
def apply_mat(obj, mat, bevel=0.0, smooth=False):
    obj.data.materials.append(mat)
    if bevel > 0:
        mod = obj.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    if smooth:
        for p in obj.data.polygons:
            p.use_smooth = True
    return obj

def add_box(name, loc, dims, mat, bevel=0.04, parent=None, col=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.object
    o.name = name
    o.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    apply_mat(o, mat, bevel)
    if parent:
        o.parent = parent
    if col:
        move_to_col(o, col)
    return o

def add_cylinder(name, loc, radius, depth, mat, parent=None, col=None, verts=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc)
    o = bpy.context.object
    o.name = name
    apply_mat(o, mat, min(radius * 0.12, depth * 0.15), True)
    if parent:
        o.parent = parent
    if col:
        move_to_col(o, col)
    return o

def add_empty(name, loc, parent=None, col=None):
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=loc)
    o = bpy.context.object
    o.name = name
    o.empty_display_size = 0.15
    if parent:
        o.parent = parent
    if col:
        move_to_col(o, col)
    return o

def add_curve(name, points, mat, thickness=0.018, parent=None, col=None):
    c = bpy.data.curves.new(name, 'CURVE')
    c.dimensions = '3D'
    c.bevel_depth = thickness
    c.bevel_resolution = 3
    s = c.splines.new('BEZIER')
    s.bezier_points.add(len(points) - 1)
    for bp, p in zip(s.bezier_points, points):
        bp.co = p
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(name, c)
    if col:
        col.objects.link(o)
    else:
        bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(mat)
    if parent:
        o.parent = parent
    return o

def set_exploded(obj, x, y, z):
    """Store exploded target as custom properties. Do NOT modify location."""
    obj["exploded_x"] = x
    obj["exploded_y"] = y
    obj["exploded_z"] = z

# ===================================================================
# SCENE CONSTRUCTION
# ===================================================================
clear_scene()

# Collections
col_body    = get_collection("BODY")
col_arms    = get_collection("ARM_ASSEMBLIES")
col_power   = get_collection("POWER_SYSTEM")
col_flight  = get_collection("FLIGHT_SYSTEM")
col_camera  = get_collection("CAMERA_SYSTEM")
col_landing = get_collection("LANDING_SYSTEM")

# Root empty
root = add_empty("Drone_Root", (0, 0, 0), col=col_body)

# ===================================================================
# 1. FUSELAGE – angular, mechanical, industrial
# ===================================================================
body = add_empty("Body", (0, 0, 0), parent=root, col=col_body)

# Main upper hull – bevelled box, slightly tapered front
upper_hull = add_box("UpperHull", (0, 0, 0.12),
                     (BODY_LENGTH, BODY_WIDTH, 0.32),
                     MAT_WHITE, bevel=0.08, parent=body, col=col_body)

# Front taper plate – narrowing wedge at the nose
front_taper = add_box("FrontTaper", (2.0, 0, 0.06),
                      (0.9, 1.4, 0.24),
                      MAT_WHITE, bevel=0.06, parent=body, col=col_body)

# Rear panel – slightly inset
rear_panel = add_box("RearPanel", (-2.0, 0, 0.08),
                     (0.5, 1.6, 0.26),
                     MAT_LOWER, bevel=0.04, parent=body, col=col_body)

# Lower hull – structural underframe
lower_hull = add_box("LowerHull", (0, 0, -0.18),
                     (BODY_LENGTH * 0.85, BODY_WIDTH * 0.75, 0.22),
                     MAT_LOWER, bevel=0.06, parent=body, col=col_body)

# Internal structural frame – visible between upper and lower
frame_plate = add_box("InternalFrame", (0, 0, -0.06),
                      (BODY_LENGTH * 0.9, BODY_WIDTH * 0.55, 0.06),
                      MAT_CARBON, bevel=0.02, parent=body, col=col_body)

# Structural side rails
for y_sign, label in [(-1, "L"), (1, "R")]:
    y = y_sign * (BODY_WIDTH * 0.42)
    add_box(f"StructuralRail_{label}", (0, y, -0.10),
            (BODY_LENGTH * 0.88, 0.07, 0.09),
            MAT_CARBON, bevel=0.02, parent=body, col=col_body)

# Frame crossmembers
for i, x in enumerate([-1.3, 0.0, 1.3]):
    add_box(f"Crossmember_{i}", (x, 0, -0.10),
            (0.06, BODY_WIDTH * 0.7, 0.07),
            MAT_METAL, bevel=0.01, parent=body, col=col_body)

# Top detail plates – mechanical panels
for i, (px, pw) in enumerate([(-0.8, 0.9), (0.5, 1.1)]):
    add_box(f"TopPanel_{i}", (px, 0, 0.29),
            (pw, BODY_WIDTH * 0.5, 0.03),
            MAT_LOWER, bevel=0.01, parent=body, col=col_body)

# Side accent strips
for y_sign, label in [(-1, "L"), (1, "R")]:
    y = y_sign * (BODY_WIDTH * 0.5 + 0.01)
    add_box(f"SideStrip_{label}", (0, y, 0.05),
            (BODY_LENGTH * 0.6, 0.025, 0.12),
            MAT_ACCENT, bevel=0.005, parent=body, col=col_body)

# ===================================================================
# 2. ARM ASSEMBLIES – local-coordinate hierarchy
# ===================================================================
# Arm specs: (name, body_attach_x, body_attach_y, rotation_z_deg)
arm_specs = [
    ("FrontLeft",   FRONT_X,  SIDE_Y,   35),
    ("FrontRight",  FRONT_X, -SIDE_Y,  -35),
    ("RearLeft",   REAR_X,   SIDE_Y,   145),
    ("RearRight",  REAR_X,  -SIDE_Y,  -145),
]

for i, (name, attach_x, attach_y, angle_deg) in enumerate(arm_specs):
    # --- Pivot at body attachment point ---
    pivot = add_empty(f"{name}_Pivot", (attach_x, attach_y, 0.0),
                      parent=root, col=col_arms)
    pivot.rotation_euler[2] = math.radians(angle_deg)

    # Exploded metadata (NOT applied to location)
    angle_rad = math.radians(angle_deg)
    ex = math.cos(angle_rad) * 1.8
    ey = math.sin(angle_rad) * 1.8
    set_exploded(pivot, ex, ey, 0.9)

    # --- Mount bracket at pivot origin (local 0,0,0) ---
    mount = add_box(f"{name}_MountBracket", (0, 0, 0),
                    (0.32, 0.30, 0.20),
                    MAT_METAL, bevel=0.03, parent=pivot, col=col_arms)

    # --- Arm extends along local +X ---
    arm_center_x = ARM_LENGTH / 2.0
    arm = add_box(f"{name}_Arm", (arm_center_x, 0, 0),
                  (ARM_LENGTH, ARM_WIDTH, ARM_HEIGHT),
                  MAT_CARBON, bevel=0.025, parent=pivot, col=col_arms)

    # --- Support brace (diagonal strut) ---
    brace_len = ARM_LENGTH * 0.55
    brace = add_box(f"{name}_Brace", (brace_len * 0.5, 0, -0.12),
                    (brace_len, 0.055, 0.055),
                    MAT_CARBON, bevel=0.01, parent=pivot, col=col_arms)
    brace.rotation_euler[1] = math.radians(8)

    # --- Motor at arm tip (local x = ARM_LENGTH) ---
    motor_x = ARM_LENGTH

    motor_mount = add_cylinder(f"{name}_MotorMount", (motor_x, 0, -0.06),
                               0.14, 0.12, MAT_METAL, parent=pivot, col=col_arms)

    motor_housing = add_cylinder(f"{name}_Motor", (motor_x, 0, 0.06),
                                  MOTOR_RADIUS, MOTOR_DEPTH, MAT_METAL,
                                  parent=pivot, col=col_arms)

    motor_top = add_cylinder(f"{name}_MotorTop", (motor_x, 0, 0.18 + 0.03),
                              MOTOR_RADIUS * 0.82, 0.06, MAT_CARBON,
                              parent=pivot, col=col_arms)

    motor_cap = add_cylinder(f"{name}_MotorCap", (motor_x, 0, 0.18 + 0.07),
                              MOTOR_RADIUS * 0.5, 0.06, MAT_BLACK,
                              parent=pivot, col=col_arms)

    # Status LED
    led = add_cylinder(f"{name}_LED", (motor_x, -MOTOR_RADIUS - 0.02, 0.06),
                        0.025, 0.02, MAT_ACCENT,
                        parent=pivot, col=col_arms, verts=12)
    led.rotation_euler[0] = math.pi / 2

    # --- Propeller hub + blades on motor ---
    prop_z = 0.18 + 0.11
    hub = add_cylinder(f"{name}_PropHub", (motor_x, 0, prop_z),
                        0.10, 0.06, MAT_METAL, parent=pivot, col=col_arms, verts=24)

    # Two-blade propeller – thin, long, aerodynamic
    for sign, blade_label in [(-1, "A"), (1, "B")]:
        blade = add_box(f"{name}_Blade_{blade_label}",
                        (motor_x + sign * PROP_LENGTH * 0.5, 0, prop_z),
                        (PROP_LENGTH, 0.10, 0.018),
                        MAT_BLACK, bevel=0.008, parent=pivot, col=col_arms)
        # Slight pitch
        blade.rotation_euler[1] = math.radians(sign * 3.5)

# ===================================================================
# 3. ELECTRONICS – inside fuselage
# ===================================================================
fc = add_box("FlightController", (0.0, 0, -0.02),
             (0.70, 0.55, 0.08), MAT_PCB, bevel=0.02, parent=body, col=col_flight)
set_exploded(fc, 0, 0, 1.5)

esc = add_box("ESC", (0.65, 0, -0.02),
              (0.55, 0.45, 0.08), MAT_PCB, bevel=0.02, parent=body, col=col_flight)
set_exploded(esc, 0.8, 0, 1.8)

cooling = add_box("CoolingSystem", (-0.5, 0, -0.02),
                  (0.50, 0.48, 0.08), MAT_METAL, bevel=0.015, parent=body, col=col_flight)
set_exploded(cooling, -0.6, 0, 1.5)

# Cooling fins
for j in range(5):
    add_box(f"CoolingFin_{j:02d}", (j * 0.08 - 0.16, 0, 0.05),
            (0.025, 0.38, 0.06), MAT_METAL, bevel=0.004,
            parent=cooling, col=col_flight)

# ===================================================================
# 4. BATTERY – mounted under body
# ===================================================================
battery_pivot = add_empty("Battery_Pivot", (0, 0, -0.34),
                          parent=root, col=col_power)
set_exploded(battery_pivot, 0, 0, -2.2)

batt_housing = add_box("BatteryHousing", (0, 0, -0.06),
                       (1.5, 0.70, 0.22), MAT_CARBON, bevel=0.06,
                       parent=battery_pivot, col=col_power)

batt_cell = add_box("Battery", (0, 0, -0.07),
                    (1.28, 0.55, 0.18), MAT_BATTERY, bevel=0.04,
                    parent=battery_pivot, col=col_power)

# Latches
for lx, ll in [(-0.65, "L"), (0.65, "R")]:
    add_box(f"BatteryLatch_{ll}", (lx, 0, -0.02),
            (0.07, 0.72, 0.10), MAT_METAL, bevel=0.01,
            parent=battery_pivot, col=col_power)

# ===================================================================
# 5. CAMERA SYSTEM – gimbal under front fuselage
# ===================================================================
camera_pivot = add_empty("Camera_Pivot", (1.0, 0, -0.32),
                         parent=root, col=col_camera)
set_exploded(camera_pivot, 1.2, 0, -2.5)

# Suspension arms
for y_sign, cl in [(-1, "L"), (1, "R")]:
    y = y_sign * 0.28
    add_curve(f"CameraSuspension_{cl}",
              [(0, y, 0.05), (0.05, y * 1.3, -0.18), (0, y * 0.9, -0.35)],
              MAT_METAL, thickness=0.03,
              parent=camera_pivot, col=col_camera)

# Gimbal frame
gimbal = add_empty("Gimbal", (0, 0, -0.40), parent=camera_pivot, col=col_camera)

gimbal_frame = add_box("GimbalFrame", (0, 0, 0),
                       (0.45, 0.40, 0.35), MAT_METAL, bevel=0.04,
                       parent=gimbal, col=col_camera)

camera_body = add_box("CameraBody", (0.06, 0, -0.02),
                      (0.32, 0.28, 0.26), MAT_BLACK, bevel=0.03,
                      parent=gimbal, col=col_camera)

lens_housing = add_cylinder("LensHousing", (0.28, 0, -0.02),
                             0.14, 0.18, MAT_METAL,
                             parent=gimbal, col=col_camera)
lens_housing.rotation_euler[1] = math.pi / 2

lens = add_cylinder("Lens", (0.38, 0, -0.02),
                     0.11, 0.04, MAT_LENS,
                     parent=gimbal, col=col_camera)
lens.rotation_euler[1] = math.pi / 2

# Camera wire
add_curve("CameraWire",
          [(-0.15, -0.20, 0.10), (-0.10, -0.28, -0.12), (0, -0.18, -0.32)],
          MAT_WIRE, thickness=0.015,
          parent=camera_pivot, col=col_camera)

# ===================================================================
# 6. LANDING STRUCTURE – two skid supports
# ===================================================================
for y_sign, label in [(-1, "L"), (1, "R")]:
    y = y_sign * 0.60
    support = add_empty(f"LandingSupport_{label}", (0, y, -0.35),
                        parent=root, col=col_landing)
    set_exploded(support, 0, y_sign * 0.8, -1.8)

    # Front strut
    strut_f = add_box(f"LandingStrut_{label}_F", (0.7, 0, -0.22),
                      (0.06, 0.06, 0.55), MAT_CARBON, bevel=0.01,
                      parent=support, col=col_landing)
    strut_f.rotation_euler[1] = math.radians(12)

    # Rear strut
    strut_r = add_box(f"LandingStrut_{label}_R", (-0.7, 0, -0.22),
                      (0.06, 0.06, 0.55), MAT_CARBON, bevel=0.01,
                      parent=support, col=col_landing)
    strut_r.rotation_euler[1] = math.radians(-12)

    # Landing ski/rail
    add_box(f"LandingSki_{label}", (0, 0, -0.50),
            (1.8, 0.065, 0.055), MAT_CARBON, bevel=0.01,
            parent=support, col=col_landing)

# ===================================================================
# 7. ANTENNAS
# ===================================================================
for y_off, label in [(-0.22, "L"), (0.22, "R")]:
    ant_base = add_cylinder(f"AntennaBase_{label}", (-1.8, y_off, 0.30),
                             0.06, 0.05, MAT_METAL, parent=root, col=col_flight, verts=16)

    ant_rod = add_box(f"Antenna_{label}", (-1.8, y_off, 0.55),
                      (0.03, 0.03, 0.45), MAT_BLACK, bevel=0.005,
                      parent=root, col=col_flight)

# ===================================================================
# 8. ASSEMBLY VALIDATION
# ===================================================================
print("\n" + "=" * 60)
print("  ASSEMBLY VALIDATION")
print("=" * 60)

bpy.context.view_layer.update()

def world_pos(obj_name):
    obj = bpy.data.objects.get(obj_name)
    if obj is None:
        return None
    return obj.matrix_world.translation.copy()

def check_distance(label, name_a, name_b, max_dist=2.0):
    pa = world_pos(name_a)
    pb = world_pos(name_b)
    if pa is None:
        print(f"[WARN] {label}: '{name_a}' not found")
        return False
    if pb is None:
        print(f"[WARN] {label}: '{name_b}' not found")
        return False
    dist = (pa - pb).length
    if dist > max_dist:
        print(f"[FAIL] {label}: distance {dist:.2f} > {max_dist:.2f}  ({name_a} -> {name_b})")
        return False
    else:
        print(f"[OK]   {label}: distance {dist:.2f}")
        return True

all_ok = True
for name, _, _, _ in arm_specs:
    all_ok &= check_distance(f"{name} motor→pivot", f"{name}_Motor", f"{name}_Pivot", ARM_LENGTH + 1.0)
    all_ok &= check_distance(f"{name} prop→motor", f"{name}_PropHub", f"{name}_Motor", 0.5)
    all_ok &= check_distance(f"{name} arm→pivot", f"{name}_Arm", f"{name}_Pivot", ARM_LENGTH)
    all_ok &= check_distance(f"{name} mount→body", f"{name}_MountBracket", "Body", 3.0)

all_ok &= check_distance("Camera→body", "Camera_Pivot", "Body", 2.0)
all_ok &= check_distance("Gimbal→camera_pivot", "Gimbal", "Camera_Pivot", 1.5)
all_ok &= check_distance("Battery→body", "Battery_Pivot", "Body", 1.5)
all_ok &= check_distance("Landing_L→body", "LandingSupport_L", "Body", 1.5)
all_ok &= check_distance("Landing_R→body", "LandingSupport_R", "Body", 1.5)

if all_ok:
    print("\n  ✓  ALL COMPONENTS ASSEMBLED CORRECTLY")
else:
    print("\n  ✗  ASSEMBLY WARNINGS DETECTED – check above")
print("=" * 60 + "\n")

# ===================================================================
# 9. CAMERA + LIGHTING + RENDER
# ===================================================================
scene = bpy.context.scene

def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

# Camera – 3/4 front perspective, pulled back to show full drone
bpy.ops.object.camera_add(location=(12.0, -13.5, 7.5))
camera = bpy.context.object
camera.name = "RenderCamera"
scene.camera = camera
camera.data.lens = 48
look_at(camera, (0, 0, -0.2))

# Three-point lighting
lights = [
    ("KeyLight",  ( 4.0, -6.0,  8.0), 1400, 5.5),
    ("FillLight", (-7.0, -2.0,  4.5),  800, 5.0),
    ("RimLight",  (-2.0,  6.0,  6.5), 1100, 4.0),
]
for light_name, loc, energy, size in lights:
    bpy.ops.object.light_add(type='AREA', location=loc)
    light = bpy.context.object
    light.name = light_name
    light.data.energy = energy
    light.data.shape = 'DISK'
    light.data.size = size
    look_at(light, (0, 0, 0))

# Render settings
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1400
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = True

try:
    scene.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass

scene.world.color = (0.015, 0.02, 0.025)

# Save and render
blend_path = os.path.join(OUTPUT_DIR, 'drone_model.blend')
render_path = os.path.join(RENDER_DIR, 'drone_assembled.png')

bpy.ops.wm.save_as_mainfile(filepath=blend_path)

# 1. Assembled render
scene.render.filepath = render_path
print("Rendering assembled drone...")
bpy.ops.render.render(write_still=True)

# 2. Component layer renders (exact same camera, lights, and resolution)
renderable_objs = [o for o in bpy.data.objects if o.type in ('MESH', 'CURVE')]

def is_prop(name):
    return any(k in name for k in ["_PropHub", "_Blade_A", "_Blade_B"])

component_groups = {
    "drone_body": [o for o in col_body.objects if o.type in ('MESH', 'CURVE')],
    "drone_arm_fl": [o for o in bpy.data.objects if o.name.startswith("FrontLeft_") and not is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_arm_fr": [o for o in bpy.data.objects if o.name.startswith("FrontRight_") and not is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_arm_rl": [o for o in bpy.data.objects if o.name.startswith("RearLeft_") and not is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_arm_rr": [o for o in bpy.data.objects if o.name.startswith("RearRight_") and not is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_prop_fl": [o for o in bpy.data.objects if o.name.startswith("FrontLeft_") and is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_prop_fr": [o for o in bpy.data.objects if o.name.startswith("FrontRight_") and is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_prop_rl": [o for o in bpy.data.objects if o.name.startswith("RearLeft_") and is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_prop_rr": [o for o in bpy.data.objects if o.name.startswith("RearRight_") and is_prop(o.name) and o.type in ('MESH', 'CURVE')],
    "drone_battery": [o for o in col_power.objects if o.type in ('MESH', 'CURVE')],
    "drone_camera": [o for o in col_camera.objects if o.type in ('MESH', 'CURVE')],
    "drone_landing": [o for o in col_landing.objects if o.type in ('MESH', 'CURVE')],
    "drone_flight": [o for o in col_flight.objects if o.type in ('MESH', 'CURVE')],
}

for comp_name, comp_objs in component_groups.items():
    print(f"Rendering component: {comp_name} ({len(comp_objs)} objects)...")
    comp_set = set(comp_objs)
    for o in renderable_objs:
        o.hide_render = (o not in comp_set)
    scene.render.filepath = os.path.join(RENDER_DIR, f"{comp_name}.png")
    bpy.ops.render.render(write_still=True)

# Restore render visibility
for o in renderable_objs:
    o.hide_render = False

print("\n" + "=" * 60)
print("  DRONE GENERATION COMPLETE (ASSEMBLED + COMPONENTS + PROPELLERS)")
print("=" * 60)
print(f"  Blend:   {blend_path}")
print(f"  Renders: {RENDER_DIR}")
print("=" * 60 + "\n")


