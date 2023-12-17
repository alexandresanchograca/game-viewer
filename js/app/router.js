define(() => {
    var internals = {};
    var externals = {};

    internals.routes = {

        list: {
            hash: "#list",
            controller: "game-list-controller"
        },

        details: {
            hash: "#details",
            controller: "details-controller"
        },
    };

    internals.deafultRoute = "list";
    
    internals.currentHash = "";

    function loadController(controllerName) {

        internals.currentHash = window.location.hash;

        require(['controllers/' + controllerName], function (controller) {

            try {

                controller.start();

            } catch (err) {

                console.log(err.stack);

                loadDefaultRoute();
            }
        })
    }

    function loadDefaultRoute() {

        window.location.hash = internals.routes[internals.deafultRoute].hash;
        loadController(internals.routes[internals.deafultRoute].controller)

    }

    function hashCheck() {
        if (window.location.hash === internals.currentHash) {
            return;
        }

        var routeName = Object.keys(internals.routes).find(function (name) {
            return window.location.hash.includes(internals.routes[name].hash);
        });

        if (!routeName) {
            loadDeafultRoute();
            return;
        }

        loadController(internals.routes[routeName].controller);
    }

    externals.start = function () {

        if (!window.location.hash) {
            window.location.hash = internals.routes[internals.deafultRoute].hash;
        }

        setInterval(hashCheck, 100);
    }

    return externals;
});