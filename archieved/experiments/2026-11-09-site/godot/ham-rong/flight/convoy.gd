extends Node2D
const W=600.0
const H=800.0
const MAX_HP=12
const SCENES=["Điện Biên · Xe đạp thồ","Trường Sơn · Người gùi","Đường cơ giới · Xe tải","Xuân 1975 · Đoàn xe"]
const YEARS=["1954","1959","1961–1964","1975"]
const DURATIONS=[24.0,27.0,31.0,35.0]
const FACTS=["Dân công dùng xe đạp được gia cố để vận chuyển hàng cho chiến dịch Điện Biên Phủ.","Đoàn 559 ra đời tháng 5/1959. Những chuyến gùi thồ đầu tiên vượt Trường Sơn trong năm ấy.","Giai đoạn 1961–1964, mạng đường mở rộng và bắt đầu phát triển vận tải cơ giới.","Bộ đội Trường Sơn bảo đảm vận chuyển cho các chiến dịch giai đoạn 1971–1975."]
const CAMERA=preload("res://vfx/ShakeCamera.tscn")
const TRAIL=preload("res://vfx/trail.tscn")
const SPARK=preload("res://vfx/hit_particles.tscn")
const BLAST=preload("res://vfx/explosion2.tscn")
const MUZZLE=preload("res://assets/VFX/muzzle.png")
const FLASH=preload("res://vfx/white.gdshader")
const MUZZLE_RECT=Rect2(80,208,56,24)
var maps=[preload("res://art/convoy/lane-0.webp"),preload("res://art/convoy/lane-1.webp"),preload("res://art/convoy/lane-2.webp"),preload("res://art/convoy/lane-3.webp")]
var units=[preload("res://art/convoy/unit-0.webp"),preload("res://art/convoy/unit-1.webp"),preload("res://art/convoy/unit-2.webp"),preload("res://art/convoy/unit-3.webp")]
var level=0
var unlocked=0
var hp=MAX_HP
var cargo=0
var delivered=0
var wave=0
var clock=0.0
var cooldown=0.0
var next_bag=0.0
var inv=0.0
var hero:=Node2D.new()
var skin:=Sprite2D.new()
var dot:=Polygon2D.new()
var cam:ShakeCamera
var ui:=CanvasLayer.new()
var menu:PanelContainer
var hud:Label
var pause_button:Button
var state="title"
var shots:Array=[]
var ports:Array=[]
var bags:Array=[]
var flash_count=0
var emitted=0
var drag=-1
var finger:=Vector2.ZERO
var origin:=Vector2.ZERO
var goal:=Vector2.ZERO
var mouse_drag=false

func _ready():
	process_mode=Node.PROCESS_MODE_ALWAYS
	cam=CAMERA.instantiate()
	cam.zoom=Vector2.ONE
	cam.position_smoothing_enabled=false
	cam.limit_left=-5000
	cam.limit_top=-5000
	cam.limit_right=5000
	cam.limit_bottom=5000
	cam.position=Vector2(300,400)
	add_child(cam)
	add_child(hero)
	hero.z_index=2
	var trail=TRAIL.instantiate()
	trail.position=Vector2(0,18)
	trail.width=5
	trail.plen=9
	trail.default_color=Color("#ddca8e85")
	hero.add_child(trail)
	var mat:=ShaderMaterial.new()
	mat.shader=FLASH
	skin.material=mat
	hero.add_child(skin)
	var ring:=Polygon2D.new()
	var pts:=PackedVector2Array()
	for j in range(16):pts.append(Vector2.RIGHT.rotated(j*TAU/16)*7)
	ring.polygon=pts
	ring.color=Color("#123b37")
	hero.add_child(ring)
	dot.polygon=pts
	dot.scale=Vector2(.58,.58)
	dot.color=Color("#fff9d8")
	hero.add_child(dot)
	add_child(ui)
	var row:=HBoxContainer.new()
	row.position=Vector2(12,6)
	row.size=Vector2(576,49)
	ui.add_child(row)
	hud=label("",18)
	hud.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	hud.add_theme_constant_override("outline_size",6)
	row.add_child(hud)
	pause_button=button("Ⅱ",pause_game)
	row.add_child(pause_button)
	var save:=ConfigFile.new()
	if save.load("user://convoy.cfg")==OK:unlocked=clampi(int(save.get_value("route","open",0)),0,3)
	level=unlocked
	setup_stage()
	title()

func label(t:String,s:int)->Label:
	var l:=Label.new()
	l.text=t
	l.add_theme_font_size_override("font_size",s)
	l.add_theme_color_override("font_color",Color("#fff4d7"))
	l.mouse_filter=Control.MOUSE_FILTER_IGNORE
	return l

func button(t:String,fn:Callable)->Button:
	var b:=Button.new()
	b.text=t
	b.custom_minimum_size=Vector2(52,48)
	b.add_theme_font_size_override("font_size",20)
	b.pressed.connect(fn)
	return b

func setup_stage():
	hero.position=Vector2(300,640)
	skin.texture=units[level]
	skin.scale=Vector2.ONE*(85.0/skin.texture.get_height())
	skin.material.set_shader_parameter("whitening",0.0)
	clock=0
	shots.clear()
	ports.clear()
	bags.clear()
	inv=0
	drag=-1
	mouse_drag=false
	wave=0
	cargo=0
	cooldown=.55
	next_bag=2.3
	update_hud()
	queue_redraw()

func overlay(t:String,body:String,b:String,fn:Callable):
	if is_instance_valid(menu):menu.queue_free()
	menu=PanelContainer.new()
	menu.position=Vector2(34,205)
	menu.custom_minimum_size=Vector2(532,0)
	var style:=StyleBoxFlat.new()
	style.bg_color=Color("#193831f3")
	style.set_corner_radius_all(12)
	for e in [SIDE_LEFT,SIDE_RIGHT,SIDE_TOP,SIDE_BOTTOM]:style.set_content_margin(e,23)
	menu.add_theme_stylebox_override("panel",style)
	ui.add_child(menu)
	var col:=VBoxContainer.new()
	col.add_theme_constant_override("separation",12)
	menu.add_child(col)
	col.add_child(label(YEARS[level]+"   /   "+SCENES[level],16))
	col.add_child(label(t,32))
	var desc=label(body,19)
	desc.custom_minimum_size.x=466
	desc.autowrap_mode=TextServer.AUTOWRAP_WORD_SMART
	col.add_child(desc)
	col.add_child(button(b,fn))
	if (state=="title" and unlocked>0 and level!=0) or state=="end":
		col.add_child(button("Về chặng 1954",func():level=0;hp=MAX_HP;delivered=0;setup_stage();title()))

func title():
	state="title"
	pause_button.visible=false
	overlay("CHỞ GẠO QUA ĐÈO",FACTS[level]+"\n\nGiữ gạo tới trạm cuối. Kéo để né, hoặc dùng WASD / mũi tên. Chấm trắng là điểm va chạm. Nhặt bao vàng để giao thêm gạo.\n\n12 sức bền. Sau mỗi chặng hồi tối đa 3 điểm.","Nhận chuyến →",start)

func start():
	if is_instance_valid(menu):menu.queue_free()
	setup_stage()
	state="run"
	pause_button.visible=true

func pause_game():
	if state!="run":return
	state="pause"
	drag=-1
	mouse_drag=false
	pause_button.visible=false
	overlay("DỪNG CHÂN","Chuyến hàng đang chờ.","Đi tiếp →",func():menu.queue_free();state="run";pause_button.visible=true)

func _notification(what):
	if what==NOTIFICATION_APPLICATION_FOCUS_OUT and state=="run" and is_inside_tree():pause_game()

func _unhandled_input(e):
	if state!="run":return
	if e is InputEventKey and e.pressed and not e.echo and e.keycode==KEY_P:pause_game()
	elif e is InputEventScreenTouch:
		if e.pressed and drag==-1:drag=e.index;finger=e.position;origin=hero.position;goal=origin
		elif not e.pressed and drag==e.index:drag=-1
	elif e is InputEventScreenDrag and drag==e.index:goal=origin+(e.position-finger)*1.15
	elif e is InputEventMouseButton and e.button_index==MOUSE_BUTTON_LEFT and e.device!=InputEvent.DEVICE_ID_EMULATION:
		mouse_drag=e.pressed;finger=e.position;origin=hero.position;goal=origin
	elif e is InputEventMouseMotion and mouse_drag:goal=origin+(e.position-finger)*1.15

# One emission event owns both the flash and the projectiles it releases.
func port(at:Vector2,dirs:Array,speed:float):
	ports.append({"p":at,"dirs":dirs,"speed":speed,"age":0.0,"fired":false})
func fan(x:float,tilt:float,count:int,speed:float):
	var dirs=[]
	for j in range(count):dirs.append(tilt+lerpf(-.88,.88,float(j)/maxi(1,count-1)))
	port(Vector2(x,76),dirs,speed)
func pattern():
	wave+=1
	var phase=mini(2,int(3*clock/DURATIONS[level]))
	var speed=220+level*24+phase*17
	var gap=clampf(300+sin(wave*.47+level)*182,85,515)
	if (wave+level+phase)%3==0:
		for j in range(15):
			var x=20+j*40
			if abs(x-gap)>56:port(Vector2(x,76),[sin(wave*.41)*.12],speed)
	elif (wave+phase)%2==0:
		fan(126+sin(wave*.4)*64,.18,8+level,speed)
		fan(474-sin(wave*.4)*64,-.18,8+level,speed)
	else:
		fan(300+sin(wave*.76)*204,sin(wave*.35)*.20,12+2*level,speed+18)
		if phase==2 and level>0:
			var left=wave%2==0
			port(Vector2(12 if left else 588,130+fmod(wave*43,200)),[-.88,-.68,-.48] if left else [.48,.68,.88],speed*.85)
	cooldown=maxf(.40,.79-.075*level-.055*phase)

func impact(at:Vector2,big:bool):
	var w=BLAST.instantiate() if big else SPARK.instantiate()
	add_child(w)
	w.global_position=at
	w.z_index=4
	w.scale=Vector2.ONE*(.31 if big else .12)
	w.one_shot=true
	w.emitting=true
	get_tree().create_timer(1.0).timeout.connect(w.queue_free)

func update_hud():
	if hud:hud.text="%d/4  ·  SỨC %d/%d  ·  GẠO %d  ·  %d%%" % [level+1,hp,MAX_HP,cargo,mini(100,int(100*clock/DURATIONS[level]))]

func _physics_process(dt):
	if state!="run":return
	clock+=dt
	inv=maxf(0,inv-dt)
	skin.material.set_shader_parameter("whitening",.62*inv if inv>0 else 0.0)
	var dir:=Vector2(float(Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_D))-float(Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_A)),float(Input.is_key_pressed(KEY_DOWN) or Input.is_key_pressed(KEY_S))-float(Input.is_key_pressed(KEY_UP) or Input.is_key_pressed(KEY_W)))
	if drag!=-1 or mouse_drag:hero.position=hero.position.move_toward(goal,700*dt)
	else:hero.position+=dir.normalized()*dt*(165 if Input.is_key_pressed(KEY_SHIFT) else 345)
	hero.position=hero.position.clamp(Vector2(38,128),Vector2(562,766))
	cooldown-=dt
	if cooldown<=0:pattern()
	next_bag-=dt
	if next_bag<=0:
		bags.append(Vector2(82+fmod(wave*103,430),76))
		next_bag=3.3
	for k in range(ports.size()-1,-1,-1):
		var a=ports[k]
		a.age+=dt
		if not a.fired and a.age>=.28:
			a.fired=true
			flash_count+=1
			for angle in a.dirs:
				var v=Vector2.DOWN.rotated(angle)*a.speed
				shots.append({"p":a.p+v.normalized()*6,"v":v})
				emitted+=1
		if a.age>.46:ports.remove_at(k)
	for k in range(shots.size()-1,-1,-1):
		var b=shots[k]
		b.p+=b.v*dt
		if inv<=0 and b.p.distance_squared_to(hero.position)<110:
			hp-=1;inv=1.05;impact(hero.position,false);cam.shake(.12,3.5);shots.remove_at(k)
			if hp==0:finish(false);return
		elif b.p.y>830 or b.p.x< -30 or b.p.x>630:shots.remove_at(k)
	for k in range(bags.size()-1,-1,-1):
		bags[k].y+=dt*155
		if bags[k].distance_to(hero.position)<29:cargo+=1;impact(bags[k],false);bags.remove_at(k)
		elif bags[k].y>825:bags.remove_at(k)
	update_hud()
	queue_redraw()
	if clock>=DURATIONS[level]:finish(true)

func finish(win:bool):
	state="end"
	pause_button.visible=false
	update_hud()
	if win:
		delivered+=cargo+1
		unlocked=maxi(unlocked,mini(3,level+1))
		var save:=ConfigFile.new()
		save.set_value("route","open",unlocked);save.save("user://convoy.cfg")
		overlay("GẠO ĐÃ TỚI TRẠM" if level<3 else "ĐÃ GIAO CHUYẾN CUỐI","Giao phần lương thực xuất phát và %d bao nhặt thêm. Còn %d/%d sức bền.\n\n%s" % [cargo,hp,MAX_HP,FACTS[level]],"Qua chặng tiếp →" if level<3 else "Chơi lại hành trình →",func():
			if level==3:level=0;hp=MAX_HP;delivered=0
			else:level+=1;hp=mini(MAX_HP,hp+3)
			start())
	else:
		impact(hero.position,true)
		overlay("CHUYẾN HÀNG DỪNG LẠI","Đã đi được %d%% chặng. Thử lại từ đầu chặng này với đủ 12 sức bền." % int(100*clock/DURATIONS[level]),"Nhận lại chuyến →",func():hp=MAX_HP;start())

func _draw():
	var scroll=clock*(70+level*7)
	var off=fmod(scroll,H)
	var idx=int(floor(scroll/H))
	for j in [-1,0]:
		var flip=(idx-j)%2!=0
		draw_set_transform(Vector2(0,off+j*H+(H if flip else 0)),0,Vector2(1,-1 if flip else 1))
		draw_texture_rect(maps[level],Rect2(0,0,W,H),false,Color(.68,.72,.66))
	draw_set_transform(Vector2.ZERO)
	for a in ports:
		if not a.fired:
			draw_arc(a.p,lerpf(15,6,a.age/.28),0,TAU,16,Color("#ffe2a4a8"),1.7,true)
		else:
			# NMLT muzzle atlas; draw the flash only, never an emitter body.
			var alpha=clampf(1-(a.age-.28)/.18,0,1)
			var face=Vector2.DOWN.rotated(a.dirs[int(a.dirs.size()/2)])
			draw_set_transform(a.p,face.angle())
			draw_texture_rect_region(MUZZLE,Rect2(-6,-11,44*alpha+10,22),MUZZLE_RECT,Color(1,1,1,alpha))
			draw_circle(Vector2.ZERO,3+alpha*4,Color(1,.90,.55,alpha))
			for j in [-1,1]:draw_line(Vector2(3,0),Vector2(19+alpha*7,j*(4+alpha*8)),Color(1,.65,.28,alpha),2,true)
			draw_set_transform(Vector2.ZERO)
	for b in shots:
		draw_line(b.p-b.v.normalized()*18,b.p,Color("#ac493eb5"),4,true)
		draw_circle(b.p,6.1,Color("#552d2c"))
		draw_circle(b.p,4.7,Color("#fe7350"))
		draw_circle(b.p,2.0,Color("#fff1b2"))
	for v in bags:
		draw_rect(Rect2(v-Vector2(9,8),Vector2(18,16)),Color("#f3c265"))
		draw_line(v+Vector2(0,-8),v+Vector2(0,8),Color("#815a37"),3)
