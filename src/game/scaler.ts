// import { MrHop } from './main';
var MrHop = MrHop || {};

// Calculate dimensions of the game so that 100% of the screen is occupied
MrHop.getGameLandscapeDimensions = function(max_w, max_h){
	// Get both w and h of the screen (they might exchange)
	var w = window.innerWidth * window.devicePixelRatio;
	var h = window.innerHeight * window.devicePixelRatio;

	// Get the actual width & height (we assume we play landscanpe)
	var landW = Math.max(w, h);
	var landH = Math.min(w, h);

	// Do we need to scale to fit in width
	if(landW > max_w){
		var ratioW = max_w / landW;
		landW *= ratioW;
		landH *= ratioW;
	}

	// Do we need to scale to fit in height
	if(landH > max_h){
		var ratioH = max_h / landH;
		landW *= ratioH;
		landH *= ratioH;
	}

	return {
		w: landW,
		h: landH
	}
}

export const getGameLandscapeDimensions = MrHop.getGameLandscapeDimensions;