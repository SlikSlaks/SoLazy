var bulletTime=0;
var ammoBar;
var ammoText;

var weapon={
	'rifle':{
			name:"rifle",
			damage:10,
			fireRate:300,
			bulletSpeed:800,
			ammo:20,
			ammoCap:20,
			reloadTime:2000,
			range:500
		},
	'pistol':{
			name:"pistol",
			damage:1,
			fireRate:400,
			bulletSpeed:800,
			ammo:5,
			ammoCap:5,
			reloadTime:1000,
			range:400
	},
	'machine_gun':{
			name:"machine_gun",
			damage:1,
			fireRate:100,
			bulletSpeed:800,
			ammo:60,
			ammoCap:60,
			reloadTime:5000,
			range:500
	},
	'sniper_rifle':{
			name:"sniper_rifle",
			damage:10,
			fireRate:1000,
			bulletSpeed:2000,
			ammo:5,
			ammoCap:5,
			reloadTime:3000,
			range:800
	}
};

var enemy_type={
	'bot':{
		stats:{
			hp:10,
			shield:0,
			speed:100,
			melee:0,
		},
		agro:true,
	}
};



var testingState={
	preload:function(){

	},
	create:function(){
		game.time.advancedTiming=true;
		flagIn=true;
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.alpha=0;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(100, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

		enemyBullets = game.add.group();
		enemyBullets.enableBody = true;
		enemyBullets.alpha=0;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		enemyBullets.createMultiple(100, 'bullet');
		enemyBullets.setAll('anchor.x', 0.5);
		enemyBullets.setAll('anchor.y', 0.5);
		enemyBullets.setAll('outOfBoundsKill', true);
		enemyBullets.setAll('checkWorldBounds', true);
		
		game.world.setBounds(0,0,w,h*3);
		grid(40,0x00ff00);
		game.graphics.alpha=0;
		enemies=game.add.group();
		enemies.alpha=0;
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
		timer = game.time.create(false);
		timer.add(1000,function(){
		    text = game.add.text(game.camera.x+game.camera.width/2, game.camera.y+game.camera.height/2, "3", { font: "65px Consolas", fill: "#00ff00", align: "center" });
		    text.anchor.x=0.5;
		    text.anchor.y=0.5;
		},this);
		timer.add(2000,function(){
		    text.text='2';
		},this);
		timer.add(3000,function(){
		    text.text='1';
		},this);
		timer.add(4000,function(){
		    text.text='GO!';
		},this);
		timer.add(5000,function(){
		    text.kill();
		},this);
		timer.add(6000,function(){
		    spawn(0,0,enemy_type.bot,{weapon:weapon.pistol},10,2000);
		    spawn(game.world.width,0,enemy_type.bot,{weapon:weapon.pistol},20,1000);
		},this);
		
		timer.add(20000,function(){
			text = game.add.text(game.camera.x, game.camera.y, "HP restored. Weapon improved", { font: "30px Consolas", fill: "#00ff00", align: "center" });
		    player.stats.hp=100;
		    player.equipment.weapon={
				name:"machine_gun",
				damage:5,
				fireRate:100,
				bulletSpeed:1000,
				ammo:100,
				ammoCap:100,
				reloadTime:3000
			};
			spawn(0,0,enemy_type.bot,{weapon:weapon.pistol},10,4000);
		    spawn(game.world.width,0,enemy_type.bot,{weapon:weapon.pistol},10,4000);

		},this);
		timer.add(22000,function(){
			spawn(0,0,enemy_type.bot,{weapon:weapon.pistol},10,2000);
		    spawn(game.world.width,0,enemy_type.bot,{weapon:weapon.pistol},10,2000);
			text.kill();
		},this);
		timer.add(30000,function(){
		    spawn(0,0,enemy_type.bot,{weapon:weapon.sniper_rifle},10,4000);
		    spawn(game.world.width,0,enemy_type.bot,{weapon:weapon.sniper_rifle},10,4000);
		},this);
		timer.add(50000,function(){
		    spawn(0,0,enemy_type.bot,{weapon:weapon.machine_gun},50,4000);
		    spawn(game.world.width,0,enemy_type.bot,{weapon:weapon.machine_gun},50,4000);
		},this);
		timer.start();
		//spawn(game.world.randomX,0,enemy_type.bot,{weapon:weapon.pistol},1,1000);
		
		
		player=game.add.sprite(game.world.centerX,game.world.height-game.camera.height/2,'player');
		player.alpha=0;
		player.equipment={
			weapon:weapon.rifle
		}


		player.stats={
			HP:100,
			maxHP:100,
			shield:0,
			maxShield:0,
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
		hpBar=new Phaser.Rectangle(game.camera.x+200, game.camera.y+200, 200, 20);
		hpText = game.add.text(0, 0, "", { font: "20px Arial", fill: "#fff", align: "center" });
		ammoBar=new Phaser.Rectangle(0,0, 200, 20);
	    ammoText = game.add.text(0, 0, "", { font: "20px Arial", fill: "#fff", align: "center" });
	    ammoText.alpha=0;
	    hpText.alpha=0;
		timer = game.time.create(false);
		enableHUD=false;
		timer.add(1000,function(){
			enableHUD=true;	
		},this);
		timer.start();
		game.add.tween(game.graphics).to({alpha:1},1000,'Linear',true);
		game.add.tween(player).to({alpha:1},1000,'Linear',true);
		game.add.tween(enemies).to({alpha:1},1000,'Linear',true);
		game.add.tween(bullets).to({alpha:1},1000,'Linear',true);
		game.add.tween(enemyBullets).to({alpha:1},1000,'Linear',true);
		game.add.tween(ammoText).to({alpha:1},1000,'Linear',true);
		game.add.tween(hpText).to({alpha:1},1000,'Linear',true);

		R = game.input.keyboard.addKey(Phaser.Keyboard.R);
    	R.onDown.add(reload, this);
	},
	update:function(){
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
		game.physics.arcade.collide(enemies, enemies);
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

		if(!player.alive&&flagIn){
			flagIn=false;
			game.add.tween(game.graphics).to({alpha:0},1000,'Linear',true);
			game.add.tween(enemies).to({alpha:0},1000,'Linear',true);
			game.add.tween(bullets).to({alpha:0},1000,'Linear',true);
			game.add.tween(enemyBullets).to({alpha:0},1000,'Linear',true);
			game.add.tween(ammoText).to({alpha:0},1000,'Linear',true);
			game.add.tween(hpText).to({alpha:0},1000,'Linear',true);
			timer = game.time.create(false);
			timer.add(2000,function(){
				enemies.removeAll(true);
				cnslText[0]=game.add.text(0,0,'System successfully tested!',fonts.consoleFont);
				cnslText[0].alpha=0;
				cnslText[0].fixedToCamera=true;
				game.add.tween(cnslText[0]).to({alpha:1},1000,'Linear',true);
			},this);
			timer.add(4000,function(){
				cnslText[1]=game.add.text(0,20,'Repairing graphics system...',fonts.consoleFont);
				cnslText[1].alpha=0;
				cnslText[1].fixedToCamera=true;
				game.add.tween(cnslText[1]).to({alpha:1},1000,'Linear',true);
			},this);
			timer.add(6000,function(){
				cnslText[2]=game.add.text(0,40,'All systems works!',fonts.consoleFont);
				cnslText[2].alpha=0;
				cnslText[2].fixedToCamera=true;
				game.add.tween(cnslText[2]).to({alpha:1},1000,'Linear',true);
			},this);
			timer.add(8000,function(){
				cnslText[3]=game.add.text(0,60,'Please stand by...',fonts.consoleFont);
				cnslText[3].alpha=0;
				cnslText[3].fixedToCamera=true;
				game.add.tween(cnslText[3]).to({alpha:1},1000,'Linear',true);
			},this);
			timer.add(10000,function(){
				game.add.tween(cnslText).to({alpha:0},1000,'Linear',true);
				music.stop();
				game.state.start('menu');
			},this);
			timer.start();
		}
		

	},
	render:function(){
		game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
		if(enableHUD&&player.alive){

			game.debug.geom(hpBar,'rgba(150,0,0,0.7)');
			game.debug.geom(ammoBar, 'rgba(150,150,150,0.7)');
		}
		
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
			game.physics.arcade.moveToXY(bullet,_x+game.camera.x, _y+game.camera.y, player.equipment.weapon.bulletSpeed);
			
			bulletTime = game.time.now + player.equipment.weapon.fireRate;
			shoot.play();
		}
	}
}

function enemyInit(param){

	if(param.agro&&Math.sqrt(Math.pow(player.x-param.x,2)+Math.pow(player.y-param.y,2))>param.equipment.weapon.range){
		param.rotation=game.physics.arcade.angleToXY(param,player.x,player.y);
		game.physics.arcade.moveToObject(param,player, enemy.stats.speed);
	}
	if(Math.sqrt(Math.pow(player.x-param.x,2)+Math.pow(player.y-param.y,2))<param.equipment.weapon.range&&player.alive){
		param.agro=true;
		param.body.velocity.x=0;
		param.body.velocity.y=0;
		param.rotation=game.physics.arcade.angleToXY(param,player.x,player.y);
		enemyShoot(param,player);
	}
	
}

function damage(enemy, bullet){
	if(!enemy.agro)
		enemy.agro=true;
	if(enemy.hp>0){
		enemy.hp-=player.equipment.weapon.damage;
	}else{
		enemy.kill();
	}
	bullet.kill();

}

function takeDamage(player,enemyBullet){
	if(player.stats.HP>=0){
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

function spawn(x,y,type,equipment,count,delay){
	var timer = game.time.create(false);
	for(var i=0;i<count;i++){
		timer.add(i*delay,function(){
			enemy=enemies.create(x,y,'enemy');
			enemy.body.collideWorldBounds=true;
			enemy.stats=type.stats;
			enemy.equipment=equipment;
			enemy.bulletTime=0;
			enemy.agro=type.agro;
			enemy.anchor.x=0.5;
			enemy.anchor.y=0.5;
		},this);
	}
	timer.start();
}

function reload(){
	bulletTime = game.time.now+player.equipment.weapon.reloadTime;
	player.equipment.weapon.ammo=player.equipment.weapon.ammoCap;
	ammoBar.width=0;
}