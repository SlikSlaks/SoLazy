var loadState={
	preload:function(){
		var loadingLable=game.add.text(game.world.centerX,game.world.centerY,'loading...',{font:'30px Courier',fill:'#009900'});
		loadingLable.anchor.x=0.5;
		loadingLable.anchor.y=0.5;	
	}
	create:function(){
        game.state.start('menu');
	}	
}
