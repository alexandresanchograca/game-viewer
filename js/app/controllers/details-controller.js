import gameView from '../views/game-details-view.js';
import gameService from '../services/game-service.js';

const start = function() {
    initialize()
};

const initialize = function() {
    gameService.getGameDetails( function(gameDetails, gameScreens, gameTrailers){
        gameView.renderGameDetails(gameDetails, gameScreens, gameTrailers);
    } );
};

export default {start};
