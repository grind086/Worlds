pc.extend(game.entity, function () {
    game.entity.Type.STAR = "Star";

    var defaults = {
        light: {
            type: "point",
            color: new pc.Color(1, 1, 0),
            radius: 1,
            castShadows: true
        }
    };

    var Star = function(options) {
        game.mergeOptions(options.light, defaults.light);
        game.application.context.systems.light.addComponent(this, options.light);
    };
    Star = pc.inherits(Star, game.entity.Planet);

    return {
        Star: Star
    };
} ());
