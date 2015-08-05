var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.image('player','assets/player.png');
	game.load.image('enemy','assets/enemy1.png'); 
	game.load.image('bullet','assets/bullet.png');
	game.load.image('loot','assets/loot.png');
	game.load.audio('shoot','assets/shoot.wav');
}

var bulletTime=0;
var line1;
var line2;
var ammoBar;
var ammoText;
var fonts={
	lootFont:{ font: "10px Arial", fill: "#fff", align: "center" },
	hudFont:{ font: "14px Arial", fill: "#fff", align: "center" }
}
var hud={
	nameText:'',
	damageText:'',
	fireRateText:'',
	bulletSpeedText:'',
	reloadTimeText:'',
	ammoText:''
}
var weapon={
	'rifle':{
			name:"rifle",
			damage:10,
			fireRate:200,
			bulletSpeed:800,
			ammo:20,
			ammoCap:20,
			reloadTime:2000
		},
	'pistol':{
			name:"pistol",
			damage:1,
			fireRate:400,
			bulletSpeed:800,
			ammo:5,
			ammoCap:5,
			reloadTime:1000
	}
};

function create() {
	

	
	
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.time.advancedTiming=true;
	
	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(100, 'bullet');
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 0.5);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true);

	enemyBullets = game.add.group();
	enemyBullets.enableBody = true;
	enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	enemyBullets.createMultiple(100, 'bullet');
	enemyBullets.setAll('anchor.x', 0.5);
	enemyBullets.setAll('anchor.y', 0.5);
	enemyBullets.setAll('outOfBoundsKill', true);
	enemyBullets.setAll('checkWorldBounds', true);
	
	game.world.setBounds(0,0,800,600);
	grid(40,0x00ff00);
	enemies=game.add.group();
	enemies.enableBody = true;
	enemies.physicsBodyType = Phaser.Physics.ARCADE;
	loot=game.add.group();
	loot.enableBody = true;
	loot.physicsBodyType = Phaser.Physics.ARCADE;
	for(var i=0;i<5;i++){
		enemy=enemies.create(game.world.randomX,game.world.randomY,'enemy');
		enemy.body.collideWorldBounds=true;
		enemy.stats={
			hp:10,
			shield:0,
			speed:150
		}
		enemy.equipment={
			weapon:weapon.pistol
		}
		enemy.bulletTime=0;
		enemy.agro=false;

	}
	enemies.setAll('anchor.x', 0.5);
	enemies.setAll('anchor.y', 0.5);
	
	
	player=game.add.sprite(game.world.centerX,game.world.centerY,'player');
	player.equipment={
		weapon:weapon.rifle

	}


	player.stats={
		HP:100,
		maxHP:100,
		shield:100,
		maxShield:100,
		speed:150
	}
	game.physics.arcade.enable(player);
	player.anchor.x=0.5;
	player.anchor.y=0.5;
	player.angle=-90;
	player.body.collideWorldBounds=true;
	game.camera.follow(player);

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	shoot=game.add.audio('shoot');
	line1 = new Phaser.Line(0, 0,0, 0);
	line2 = new Phaser.Line(0, 0,0, 0);
	hpBar=new Phaser.Rectangle(game.camera.x+200, game.camera.y+200, 200, 20);
	hpText = game.add.text(0, 0, "", { font: "20px Arial", fill: "#fff", align: "center" });
	ammoBar=new Phaser.Rectangle(0,0, 200, 20);
    ammoText = game.add.text(0, 0, "", { font: "20px Arial", fill: "#fff", align: "center" });

	hud.nameText=game.add.text(game.camera.x+game.camera.width-250, game.camera.y+game.camera.height-160, 'name: '+player.equipment.weapon.name, fonts.hudFont);
	hud.damageText=game.add.text(game.camera.x+game.camera.width-250, game.camera.y+game.camera.height-140, 'damage: '+player.equipment.weapon.damage, fonts.hudFont);
	hud.fireRateText=game.add.text(game.camera.x+game.camera.width-250, game.camera.y+game.camera.height-120, 'fireRate: '+player.equipment.weapon.fireRate,fonts.hudFont);
	hud.bulletSpeedText=game.add.text(game.camera.x+game.camera.width-250, game.camera.y+game.camera.height-100, 'bulletSpeed: '+player.equipment.weapon.bulletSpeed, fonts.hudFont);
	hud.reloadTimeText=game.add.text(game.camera.x+game.camera.width-250, game.camera.y+game.camera.height-80, 'reloadTime: '+player.equipment.weapon.reloadTime, fonts.hudFont);
	hud.ammoText=game.add.text(game.camera.x+game.camera.width-250, game.camera.y+game.camera.height-60, 'ammo: '+player.equipment.weapon.ammo, fonts.hudFont);


}

function update () {


	hpBar.x=game.camera.x+20;
	hpBar.y=game.camera.y+game.camera.height-40;
	hpText.x=hpBar.x;
	hpText.y=hpBar.y;
	hpText.text=player.stats.HP+"/"+player.stats.maxHP;
	ammoBar.x=game.camera.x+game.camera.width-250;
	ammoBar.y=game.camera.y+game.camera.height-40;
	ammoText.x=game.camera.x+game.camera.width-250;
	ammoText.y=game.camera.y+game.camera.height-40;
	hpBar.width=200-200/player.stats.maxHP*(player.stats.maxHP-player.stats.HP);

	if(ammoBar.width==0){
		if(player.equipment.weapon.ammo==player.equipment.weapon.ammoCap)
		ammoText.text="reloading...";
		if(game.time.now >= bulletTime){
			ammoBar.width=200-200/player.equipment.weapon.ammoCap*(player.equipment.weapon.ammoCap-player.equipment.weapon.ammo);
			ammoText.text=""+player.equipment.weapon.ammo+"/"+player.equipment.weapon.ammoCap;
		}
	}else{
		ammoBar.width=200-200/player.equipment.weapon.ammoCap*(player.equipment.weapon.ammoCap-player.equipment.weapon.ammo);
		ammoText.text=""+player.equipment.weapon.ammo+"/"+player.equipment.weapon.ammoCap;
	}
	

	enemies.forEach(enemyInit,true,true);
	//loot.forEach(hideLoot,true,true);
	game.physics.arcade.collide(player, enemies);
	game.physics.arcade.overlap(enemies, bullets,damage,null, this);
	game.physics.arcade.overlap(player, enemyBullets,takeDamage,null, this);
	//game.physics.arcade.overlap(player, loot,showLoot,null, this);

	player.body.velocity.x=0;
	player.body.velocity.y=0;
	if(upKey.isDown){
		player.body.velocity.y=-player.stats.speed;
	}
	if(downKey.isDown){
		player.body.velocity.y=player.stats.speed;
	}
	if(leftKey.isDown){
		player.body.velocity.x=-player.stats.speed;
	}
	if(rightKey.isDown){
		player.body.velocity.x=player.stats.speed;
	}
	if(game.input.activePointer.isDown){
		fireBullet();
	}
	player.rotation = game.physics.arcade.angleToPointer(player);
}

function render () {
	game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
	game.debug.geom(line1);
	game.debug.geom(hpBar,'rgba(150,0,0,0.7)');
	game.debug.geom(ammoBar, 'rgba(150,150,150,0.7)');
}

function grid(scale,color){
	if(!game.graphics)
		game.graphics = game.add.graphics(0, 0);
	game.graphics.lineStyle(1, color, 1);
	for(var i=0;i<game.world.height/scale;i++){
		game.graphics.moveTo(0,i*scale);
		game.graphics.lineTo(game.world.width,i*scale);
	}
	for(var i=0;i<game.world.width/scale;i++){
		game.graphics.moveTo(i*scale,0);
		game.graphics.lineTo(i*scale,game.world.height);
	}
}

function fireBullet () {
	if(!player.alive)
		return;
	//  To avoid them being allowed to fire too fast we set a time limit
	if (game.time.now > bulletTime)
	{
		if(player.equipment.weapon.ammo==0){
			bulletTime = game.time.now+player.equipment.weapon.reloadTime;
			player.equipment.weapon.ammo=player.equipment.weapon.ammoCap;
			return;
		}
		//  Grab the first bullet we can from the pool

		bullet = bullets.getFirstExists(false);

		if (bullet)
		{
			//  And fire it
			player.equipment.weapon.ammo--;
			bullet.reset(player.x, player.y);
			bullet.rotation=game.physics.arcade.angleToPointer(player)+90*Math.PI/180;

			rad=Math.sqrt(Math.pow(game.input.activePointer.x-player.x,2)+Math.pow(game.input.activePointer.y-player.y,2));
			_x=player.x+rad*(Math.cos(Math.acos((game.input.activePointer.x-player.x)/rad)));
			_y=player.y+rad*(Math.sin(Math.asin((game.input.activePointer.y-player.y)/rad)));
			game.physics.arcade.moveToXY(bullet,_x, _y, player.equipment.weapon.bulletSpeed);
			
			bulletTime = game.time.now + player.equipment.weapon.fireRate;
			shoot.play();
		}
	}
}

function enemyInit(param){

	if(param.agro&&Math.sqrt(Math.pow(player.x-param.x,2)+Math.pow(player.y-param.y,2))>200){
		param.rotation=game.physics.arcade.angleToXY(param,player.x,player.y);
		game.physics.arcade.moveToObject(param,player, enemy.stats.speed);
	}
	if(Math.sqrt(Math.pow(player.x-param.x,2)+Math.pow(player.y-param.y,2))<200&&player.alive){
		param.agro=true;
		param.rotation=game.physics.arcade.angleToXY(param,player.x,player.y);
		enemyShoot(param,player);
	}
	
}
/*
function showLoot(player,loot){
	loot.text.pickUp.visible=true;
	loot.text.refine.visible=true;
	loot.text.nameText.visible=true;
	loot.text.damageText.visible=true;
	loot.text.fireRateText.visible=true;
	loot.text.bulletSpeedText.visible=true;
	loot.text.reloadTimeText.visible=true;
	loot.text.ammoText.visible=true;
}

function hideLoot(loot){
		loot.text.pickUp.visible=false;
		loot.text.refine.visible=false;
		loot.text.nameText.visible=false;
		loot.text.damageText.visible=false;
		loot.text.fireRateText.visible=false;
		loot.text.bulletSpeedText.visible=false;
		loot.text.reloadTimeText.visible=false;
		loot.text.ammoText.visible=false;
}
*/
function damage(enemy, bullet){
	if(!enemy.agro)
		enemy.agro=true;
	if(enemy.hp>0){
		enemy.hp-=player.equipment.weapon.damage;
	}else{
		/*
		drop=loot.create(enemy.x,enemy.y,'loot');
		drop.weapon=enemy.equipment.weapon;
		
		drop.text={
			backgroundImg:'',
			pickUp:game.add.text(drop.x+20, drop.y-10, 'F to pick up', fonts.hudFont),
			refine:game.add.text(drop.x+20, drop.y, 'G to refine', fonts.hudFont),
			nameText:game.add.text(drop.x+20, drop.y, 'name: '+drop.weapon.name, fonts.lootFont),
			damageText:game.add.text(drop.x+20, drop.y+10, 'damage: '+drop.weapon.damage, fonts.lootFont),
			fireRateText:game.add.text(drop.x+20, drop.y+20, 'fireRate: '+drop.weapon.fireRate,fonts.lootFont),
			bulletSpeedText:game.add.text(drop.x+20, drop.y+30, 'bulletSpeed: '+drop.weapon.bulletSpeed, fonts.lootFont),
			reloadTimeText:game.add.text(drop.x+20, drop.y+40, 'reloadTime: '+drop.weapon.reloadTime, fonts.lootFont),
			ammoText:game.add.text(drop.x+20, drop.y+50, 'ammo: '+drop.weapon.ammo, fonts.lootFont)
		}
		drop.text.pickUp.visible=false;
		drop.text.refine.visible=false;
		drop.text.nameText.visible=false;
		drop.text.damageText.visible=false;
		drop.text.fireRateText.visible=false;
		drop.text.bulletSpeedText.visible=false;
		drop.text.reloadTimeText.visible=false;
		drop.text.ammoText.visible=false;
		*/
		enemy.kill();

	}
	bullet.kill();

}

function takeDamage(player,enemyBullet){
	if(player.stats.HP>0){
		player.stats.HP-=enemyBullet.enemy.equipment.weapon.damage;
	}else{
		player.kill();
	}
	enemyBullet.kill();
}

function enemyShoot(enemy,player){
	if (game.time.now > enemy.bulletTime)
	{
		if(enemy.equipment.weapon.ammo==0){
			enemy.bulletTime = game.time.now+enemy.equipment.weapon.reloadTime;
			enemy.equipment.weapon.ammo=enemy.equipment.weapon.ammoCap;
			return;
		}
		//  Grab the first bullet we can from the pool

		bullet = enemyBullets.getFirstExists(false);

		if (bullet)
		{
			//  And fire it
			enemy.equipment.weapon.ammo--;
			bullet.reset(enemy.x, enemy.y);
			bullet.rotation=game.physics.arcade.angleToXY(enemy,player.x,player.y)+90*Math.PI/180;
			bullet.enemy=enemy;
			game.physics.arcade.moveToObject(bullet,player, enemy.equipment.weapon.bulletSpeed);
			enemy.bulletTime = game.time.now + enemy.equipment.weapon.fireRate;
			shoot.play();
		}
	}
}