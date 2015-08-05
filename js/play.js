var playState={
	create:function(){
		game.time.advancedTiming=true;
    },
	update:function(){
			},
	render:function(){
		game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
	}		
}

