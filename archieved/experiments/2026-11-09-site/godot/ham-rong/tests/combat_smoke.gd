extends SceneTree
var g
var steps=0
var wins=0
var fx_seen=false
var max_shots=0
var previous_hp=12
func _initialize():call_deferred("boot")
func boot():
	g=load("res://flight/river.tscn").instantiate()
	root.add_child(g)
	g.level=0;g.hp=12;g.start()
func _physics_process(_dt):
	if not is_instance_valid(g):return false
	steps+=1
	if steps>16000:printerr("TIMEOUT ",wins," ",g.level," ",g.hp," ",g.clock);quit(7);return false
	if steps==60:
		g.pause_game()
		assert(g.state=="pause")
		g.menu.get_child(0).get_child(3).pressed.emit()
		assert(g.state=="run")
	if g.state=="end":
		if wins==4 and g.hp==0:
			assert(fx_seen and max_shots>=40)
			print("PASS 4 deliveries, 12-hit loss, visible spawn events, peak ",max_shots," projectiles")
			g.start();assert(g.state=="run");quit(0);return false
		if g.hp<=0:printerr("LOST ",g.level," ",g.clock," hits ",g.hp);quit(6);return false
		print("DELIVERY ",g.level," hp ",g.hp," shots ",g.emitted)
		wins+=1
		if wins==4:g.level=3;g.hp=12;g.start()
		else:g.menu.get_child(0).get_child(3).pressed.emit()
		return false
	if g.state!="run":return false
	max_shots=maxi(max_shots,g.shots.size())
	for a in g.ports:
		if a.fired and a.age<=.46:fx_seen=true
	g.mouse_drag=true
	var best=-1e20
	var pos:Vector2=g.hero.position
	if wins==4:
		for b in g.shots:
			var t:Vector2=b.p+b.v*.08
			if t.y>150 and -pos.distance_squared_to(t)>best:best=-pos.distance_squared_to(t);g.goal=t
	else:
		for delta in [Vector2.ZERO,Vector2.LEFT,Vector2.RIGHT,Vector2.UP,Vector2.DOWN,Vector2(-.7,-.7),Vector2(.7,-.7),Vector2(.7,.7),Vector2(-.7,.7)]:
			var score=10000.
			for lead in [.09,.21,.37]:
				var future=(pos+delta*(380.0*lead)).clamp(Vector2(38,128),Vector2(562,766))
				for b in g.shots:
					score=minf(score,(b.p+b.v*lead).distance_squared_to(future)+lead*35)
			score-=delta.length()*.1
			if score>best:best=score;g.goal=pos+delta*6.3
	return false
