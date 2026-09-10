import bpy
import math
import os
from mathutils import Vector

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "drone_assets")
RENDER_DIR = os.path.join(OUTPUT_DIR, "renders")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(RENDER_DIR, exist_ok=True)

def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

def collection(name):
    col = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    if col.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(col)
    return col

def move(obj, col):
    for old in list(obj.users_collection): old.objects.unlink(obj)
    col.objects.link(obj)

def material(name, color, metallic=0, roughness=.4):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return m

WHITE=material("Ceramic white shell",(.78,.80,.80),.14,.29); LOWER=material("Warm grey lower shell",(.24,.27,.28),.28,.31)
CARBON=material("Carbon composite",(.012,.017,.022),.36,.28); BLACK=material("Matte black",(.006,.008,.01),.04,.42)
METAL=material("Machined aluminium",(.27,.30,.32),.88,.19); PCB=material("PCB green",(.012,.12,.052),.12,.33)
BATTERY=material("Battery graphite",(.035,.045,.052),.24,.31); LENS=material("Optical glass",(.003,.012,.020),.7,.07)
ACCENT=material("Safety green",(.03,.55,.28),.15,.27); WIRE=material("Wire red",(.20,.012,.008),.1,.35)

def finish(obj, mat, bevel=0, smooth=False):
    obj.data.materials.append(mat)
    if bevel:
        mod=obj.modifiers.new("Precision edge radii","BEVEL"); mod.width=bevel; mod.segments=3
    if smooth:
        for p in obj.data.polygons: p.use_smooth=True
    return obj

def box(name, loc, dims, mat, bevel=.04, col=None):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.name=name; o.dimensions=dims
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); finish(o,mat,bevel)
    if col: move(o,col)
    return o

def cylinder(name, loc, radius, depth, mat, col=None, verts=40):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=radius,depth=depth,location=loc); o=bpy.context.object; o.name=name
    finish(o,mat,min(radius*.13,depth*.18),True)
    if col: move(o,col)
    return o

def sphere(name,loc,scale,mat,col=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=20,location=loc); o=bpy.context.object; o.name=name; o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); finish(o,mat,0,True)
    if col: move(o,col)
    return o

def empty(name,loc,col,parent=None):
    bpy.ops.object.empty_add(type="PLAIN_AXES",location=loc); o=bpy.context.object; o.name=name; o.empty_display_size=.18; move(o,col); o.parent=parent; return o

def beam(name,a,b,width,height,mat,col,parent_obj=None):
    a,b=Vector(a),Vector(b); d=b-a; o=box(name,(a+b)/2,(d.length,width,height),mat,.045,col)
    o.rotation_euler=d.to_track_quat('X','Z').to_euler()
    if parent_obj:o.parent=parent_obj
    return o

def curve(name,points,mat,col,thickness=.018,parent_obj=None):
    c=bpy.data.curves.new(name,'CURVE'); c.dimensions='3D'; c.bevel_depth=thickness; c.bevel_resolution=3
    s=c.splines.new('BEZIER'); s.bezier_points.add(len(points)-1)
    for bp,p in zip(s.bezier_points,points): bp.co=p; bp.handle_left_type='AUTO'; bp.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,c); col.objects.link(o); o.data.materials.append(mat); o.parent=parent_obj; return o

def propeller(name,loc,angle,col,parent_obj):
    hub=cylinder(name+"_Hub",loc,.105,.07,METAL,col,28); hub.parent=parent_obj
    for sign,label in [(-1,'A'),(1,'B')]:
        blade=box(name+"_Blade_"+label,loc,(1.55,.105,.022),BLACK,.045,col); blade.rotation_euler[2]=angle
        blade.location+=Vector((math.cos(angle),math.sin(angle),0))*sign*.46; blade.rotation_euler[0]=math.radians(sign*4); blade.parent=parent_obj

def motor_assembly(prefix,motor_pos,arm,col,prop_angle):
    motor=cylinder(prefix+"_Motor",motor_pos,.245,.25,METAL,col); motor.parent=arm
    top=cylinder(prefix+"_MotorTop",Vector(motor_pos)+Vector((0,0,.125)),.205,.06,CARBON,col); top.parent=motor
    cap=cylinder(prefix+"_MotorCap",Vector(motor_pos)+Vector((0,0,.17)),.13,.065,BLACK,col); cap.parent=motor
    led=cylinder(prefix+"_StatusLED",Vector(motor_pos)+Vector((0,-.205,.07)),.028,.02,ACCENT,col,16); led.rotation_euler[0]=math.pi/2; led.parent=motor
    propeller(prefix+"_Propeller",Vector(motor_pos)+Vector((0,0,.21)),prop_angle,col,motor)

clear_scene()
root_col=collection("DRONE"); body_col=collection("BODY"); arms_col=collection("ARM_ASSEMBLIES"); power_col=collection("POWER_SYSTEM")
flight_col=collection("FLIGHT_SYSTEM"); camera_col=collection("CAMERA_SYSTEM"); landing_col=collection("LANDING_SYSTEM")
root=empty("Drone_Root",(0,0,0),root_col)

# Slender aircraft-like fuselage, longitudinal along X. Layered parts leave a mechanical gap.
body=empty("Body",(0,0,0),body_col,root)
for obj in [sphere("UpperShell",(-.05,0,.18),(2.18,.78,.34),WHITE,body_col),sphere("NoseShell",(1.88,0,.10),(.72,.64,.29),WHITE,body_col),sphere("RearShell",(-2.00,0,.14),(.52,.52,.24),WHITE,body_col),box("LowerShell",(-.08,0,-.17),(3.55,1.20,.24),LOWER,.12,body_col),box("InternalFrame",(-.15,0,-.37),(3.4,.86,.10),CARBON,.035,body_col)]:obj.parent=body
for y,label in [(-.46,'L'),(.46,'R')]: box("StructuralRail_"+label,(-.12,y,-.44),(3.5,.075,.09),CARBON,.025,body_col).parent=body
for x in (-1.28,.15,1.18): box("FrameCrossmember_"+str(x),(x,0,-.42),(.065,1.12,.08),METAL,.015,body_col).parent=body

# Addressable electronics, visible in the fuselage's exposed underframe.
for obj in [box("FlightController",(-.35,0,-.27),(.74,.60,.10),PCB,.025,flight_col),box("ESC",(.60,0,-.28),(.62,.48,.10),PCB,.025,flight_col),box("CoolingSystem",(.12,0,-.18),(.54,.52,.10),METAL,.02,flight_col)]:obj.parent=root
for i in range(6): box("CoolingFin_%02d"%i,(-.10+i*.085,0,-.09),(.028,.43,.11),METAL,.006,flight_col).parent=bpy.data.objects['CoolingSystem']

battery_pivot=empty("Battery_Pivot",(-.58,0,-.42),power_col,root); battery_pivot['exploded_x'],battery_pivot['exploded_y'],battery_pivot['exploded_z']=(0,0,-2)
for obj in [box("BatteryHousing",(-.58,0,-.53),(1.55,.72,.24),CARBON,.08,power_col),box("Battery",(-.58,0,-.67),(1.31,.57,.25),BATTERY,.06,power_col),box("BatteryLatch_L",(-1.19,0,-.60),(.08,.76,.12),METAL,.015,power_col),box("BatteryLatch_R",(.03,0,-.60),(.08,.76,.12),METAL,.015,power_col)]:obj.parent=battery_pivot

# Four very long, thin exposed booms make the industrial silhouette rather than a consumer-drone box.
specs=[("FrontLeft",(1.05,.50,0),(2.75,3.45,.13)),("FrontRight",(1.05,-.50,0),(2.75,-3.45,.13)),("RearLeft",(-1.25,.48,0),(-2.72,3.40,.13)),("RearRight",(-1.25,-.48,0),(-2.72,-3.40,.13))]
for i,(name,start,end) in enumerate(specs):
    pivot=empty(name+"_Pivot",start,arms_col,root); pivot['exploded_x'],pivot['exploded_y'],pivot['exploded_z']=(end[0]*.20,end[1]*.18,.8)
    box(name+"_MountBracket",start,(.34,.32,.22),METAL,.04,arms_col).parent=pivot
    arm=beam(name+"_Arm",start,end,.17,.14,CARBON,arms_col,pivot)
    beam(name+"_Brace",(start[0],start[1],-.30),((start[0]+end[0])*.5,(start[1]+end[1])*.5,-.08),.055,.055,CARBON,arms_col,pivot)
    motor_assembly(name,end,arm,arms_col,math.radians(10 if i%2==0 else -10))

# Serious separated imaging payload under the forward fuselage.
camera_pivot=empty("Camera_Pivot",(1,0,-.48),camera_col,root); camera_pivot['exploded_x'],camera_pivot['exploded_y'],camera_pivot['exploded_z']=(.8,0,-2.1)
curve("CameraSuspension_L",[(1,-.40,-.28),(1.02,-.50,-.60),(1,-.34,-.88)],METAL,camera_col,.035,camera_pivot); curve("CameraSuspension_R",[(1,.40,-.28),(1.02,.50,-.60),(1,.34,-.88)],METAL,camera_col,.035,camera_pivot)
gimbal=empty("Gimbal",(1.05,0,-.93),camera_col,camera_pivot)
for obj in [sphere("GimbalFrame",(1.05,0,-.93),(.42,.42,.42),METAL,camera_col),sphere("CameraBody",(1.11,0,-.96),(.34,.31,.29),BLACK,camera_col)]:obj.parent=gimbal
lens_h=cylinder("LensHousing",(1.43,0,-.96),.22,.20,METAL,camera_col);lens_h.rotation_euler[1]=math.pi/2;lens_h.parent=gimbal
lens=cylinder("Lens",(1.55,0,-.96),.165,.035,LENS,camera_col);lens.rotation_euler[1]=math.pi/2;lens.parent=gimbal

for y,label in [(-.63,'L'),(.63,'R')]:
    support=empty("LandingSupport_"+label,(0,y,-.48),landing_col,root)
    beam("LandingStrut_"+label+"_F",(.85,y,-.35),(.55,y,-1.20),.06,.07,CARBON,landing_col,support);beam("LandingStrut_"+label+"_R",(-.85,y,-.35),(-1.15,y,-1.14),.06,.07,CARBON,landing_col,support);beam("LandingSki_"+label,(-.25,y,-1.20),(1.08,y,-1.20),.075,.065,CARBON,landing_col,support)
for y,label in [(-.25,'R'),(.25,'L')]:
    beam("Antenna_"+label,(-1.48,y,.35),(-1.92,y,.91),.035,.035,BLACK,flight_col,root);cylinder("AntennaBase_"+label,(-1.48,y,.35),.07,.06,METAL,flight_col,16).parent=root
curve("CameraWire",[(.55,-.36,-.27),(.80,-.46,-.55),(1,-.34,-.81)],WIRE,camera_col,.018,camera_pivot)

# Everything above was authored in world coordinates, then placed into a clean
# animation hierarchy. Preserve those authored coordinates when applying parents.
bpy.context.view_layer.update()
def hierarchy_depth(obj):
    return 0 if obj.parent is None else 1 + hierarchy_depth(obj.parent)
for obj in sorted(bpy.context.scene.objects, key=hierarchy_depth):
    if obj.parent:
        obj.matrix_parent_inverse = obj.parent.matrix_world.inverted()

# Explicit world placement for nested payload and motor children.  This keeps the
# assembly hierarchy intact while guaranteeing the child parts stay on their booms.
for i, (name, start, end) in enumerate(specs):
    pos = Vector(end)
    positions = {
        name + "_Motor": pos,
        name + "_MotorTop": pos + Vector((0,0,.125)),
        name + "_MotorCap": pos + Vector((0,0,.17)),
        name + "_StatusLED": pos + Vector((0,-.205,.07)),
        name + "_Propeller_Hub": pos + Vector((0,0,.21)),
    }
    angle = math.radians(10 if i % 2 == 0 else -10)
    for sign, label in [(-1,'A'),(1,'B')]:
        positions[name + "_Propeller_Blade_" + label] = pos + Vector((0,0,.21)) + Vector((math.cos(angle),math.sin(angle),0))*sign*.46
    for obj_name, location in positions.items():
        obj = bpy.data.objects.get(obj_name)
        if obj: obj.matrix_world.translation = location
for obj_name, location in {
    "GimbalFrame":(1.05,0,-.93), "CameraBody":(1.11,0,-.96),
    "LensHousing":(1.43,0,-.96), "Lens":(1.55,0,-.96)
}.items():
    bpy.data.objects[obj_name].matrix_world.translation = location

scene=bpy.context.scene
def look_at(obj,point):obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(8.9,-10.8,5.8));camera=bpy.context.object;camera.name="RenderCamera";scene.camera=camera;camera.data.lens=57;look_at(camera,(0,0,-.28))
for name,loc,energy,size in [('KeyLight',(3.5,-5.5,8),1250,5.5),('FillLight',(-6,-2,4),750,5),('RimLight',(-2,5,6),1050,4)]:
    bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.name=name;light.data.energy=energy;light.data.shape='DISK';light.data.size=size;look_at(light,(0,0,0))
scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=1400;scene.render.resolution_y=900;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
try:scene.view_settings.look='AgX - Medium High Contrast'
except:pass
scene.world.color=(.015,.02,.025)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUTPUT_DIR,'drone_model.blend'));scene.render.filepath=os.path.join(RENDER_DIR,'drone_assembled.png');bpy.ops.render.render(write_still=True)
print('DRONE GENERATION COMPLETE');print('Blend:  '+os.path.join(OUTPUT_DIR,'drone_model.blend'));print('Render: '+scene.render.filepath)
