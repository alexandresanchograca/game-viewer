import gameView from '../views/game-list-view.js';
import gameService from '../services/game-service.js';

const start = function() {
    bindEventHandlers();
    initialize()
};

const bindEventHandlers = function() {
    gameView.bind('searchBtn', searchButtonHandler);
    gameView.bind('loadMoreBtn', loadMoreSearchHandler);
};

const searchButtonHandler = function() {
    gameService.searchGame(function(gameSearchArr) {
        gameView.render(gameSearchArr);
    });
};

const loadMoreSearchHandler = function() {
    gameService.loadMoreSearch(function(gameSearchArr) {
        gameView.render(gameSearchArr);
    });
};

const initialize = function() {
    gameService.getGameList( function(gameListArr){
        gameView.render(gameListArr);
    } );
};

export default {start};