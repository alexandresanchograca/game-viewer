    import gameListController from './controllers/game-list-controller.js'
    import detailsController from './controllers/details-controller.js'

    const defaultRoute = "list";
    
    var currentHash = "";

    const routes = {

        list: {
            hash: "#list",
            controller: gameListController
        },

        details: {
            hash: "#details",
            controller: detailsController
        },
    };

    function loadController(controller) {

        currentHash = window.location.hash;

        try {

            controller.start();

        } catch (err) {

            console.log(err.stack);
            loadDefaultRoute();
        }
    }

    function loadDefaultRoute() {
        window.location.hash = routes[defaultRoute].hash;
        loadController(routes[defaultRoute].controller)
    }

    function hashCheck() {
        if (window.location.hash === currentHash) {
            return;
        }

        var routeName = Object.keys(routes).find(function (name) {
            return window.location.hash.includes(routes[name].hash);
        });

        if (!routeName) {
            loadDefaultRoute();
            return;
        }

        loadController(routes[routeName].controller);
    }

    var start = function () {

        if (!window.location.hash) {
            window.location.hash = routes[defaultRoute].hash;
        }

        setInterval(hashCheck, 100);
    }

    export default {start} // default export
