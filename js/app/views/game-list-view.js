define(function () {
    var internals = {
        handlers: {},
        elements: {}
    };

    var externals = {};

    internals.platformIconMap = {
        1: `<i class="platform-icon fa-brands fa-windows"></i>`,
        2: `<i class="platform-icon fa-brands fa-playstation"></i>`,
        3: `<i class="platform-icon fa-brands fa-xbox"></i>`,
        5: `<i class="platform-icon fa-brands fa-apple"></i>`,
        get: function (id) {
            return this.hasOwnProperty(id) ? this[id] : "";
        }
    }

    internals.ratingMap = {
        1: `<div class="rating-badge" style="background-color: rgba(255, 0, 0, 0.249);">Really Bad</div>`,
        2: `<div class="rating-badge" style="background-color: rgba(255, 106, 0, 0.249);">Bad</div>`,
        3: `<div class="rating-badge" style="background-color: rgba(255, 183, 0, 0.249);">Average</div>`,
        4: `<div class="rating-badge" style="background-color: rgba(251, 255, 0, 0.249);">Good</div>`,
        5: `<div class="rating-badge" style="background-color: rgba(17, 255, 0, 0.249);">Excellent</div>`,
        get: function (id) {
            return this.hasOwnProperty(id) ? this[id] : `<div class="badge badge-secondary">No Reviews</div>`;
        }
    }

    internals.renderRating = function (game) {
        return internals.ratingMap.get(game.rating_top);
    }

    internals.createViewMoreButton = function (game) {
        return `<a href="#details?id=${game.id}" class="btn btn-secondary">View More</a>`;
    }

    internals.renderThumbImage = function (game) {

        if(!game.background_image){
            return `<img class="card-img-top" src="https://media.rawg.io/media/screenshots/596/5968ba06bac8bee0ec7e9d03c970c421.jpg" alt="Game Image"/>`;
        }

        return `<img class="card-img-top" src="${game.background_image}" alt="Game Image"/>`;
    }

    internals.renderTitle = function (game) {
        return `<h5 class="game-title card-title">${game.name}</h5>`;
    }

    internals.renderAvailablePlatforms = function (game) {
        if(!game.parent_platforms){
            return;
        }

        var gamePlatforms = `<div class="platforms">`;

        game.parent_platforms.forEach(platform => {
            gamePlatforms += internals.platformIconMap.get(platform.platform.id);
        })
        return gamePlatforms;
    }
    
    internals.createLoadMoreButton = function (pageNumber) {
        $("#loadmore-btn").remove();

        $(`<button id="loadmore-btn" class="btn btn-secondary">Load More</button>`)
            .on('click', internals.handlers['loadMoreBtn'])
            .appendTo(internals.elements.gameList);
    }

    internals.createSearchBar = function () {
        return `<div class="input-group rounded" id="search-box">
                    <input id="search-input" type="search" class="form-control mr-sm-6" placeholder="Search" aria-label="Search" aria-label="Search"/>
                    <span class="input-group-text border-0 bg-dark" id="search-addon">
                    </span>
                </div>`;
    };

    internals.renderSearchButton = function () {
        if ($("#search-box").length) {
            return;
        }
        
        internals.elements.searchBar = $(internals.createSearchBar());
        internals.elements.app.prepend(internals.elements.searchBar);

        internals.elements.searchButton = $(`<button class="btn btn-outline-secondary my-2 my-sm-0" type="button" id="search-btn"><i class="fas fa-search"></i></button>`);
        internals.elements.searchButton.click(internals.handlers['searchBtn']);
        internals.elements.searchBar.append(internals.elements.searchButton);
    };

    externals.bind = function (event, handler) {
        internals.handlers[event] = handler;
    };

    externals.render = function (gameListArr) {
        internals.elements.app = $('#app');
        internals.elements.gameList = $('#gamelist');

        //Add search button functionality
        internals.renderSearchButton();

        //Create a home / go back button
        $("#back-btn").remove();
        internals.elements.app.prepend(`<a href="#home" id="back-btn" class="btn btn-secondary"><i class="fa-solid fa-house"></i></a>`);

        var cardDeck = $(`<div class="row">`)

        gameListArr.forEach(function (game) {

            var gameCard = $(`
            <div class="card border-secondary bg-dark text-white text-center" style="width: 18rem;">
                ${internals.renderThumbImage(game)}
                <div class="card-body">
                    ${internals.renderAvailablePlatforms(game)}
                    ${internals.renderRating(game)}
                    ${internals.renderTitle(game)}
                    ${internals.createViewMoreButton(game)}
                </div>
            </div>
        `);

            gameCard.appendTo(cardDeck)
        });

        internals.elements.gameList.append(cardDeck);
        internals.createLoadMoreButton();
    }
    return externals;
});
