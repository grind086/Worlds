pc.extend(game.entity, function () {
    game.entity.Type.STAR = "Star";

    var Star = function() {
        game.application.context.systems.light.addComponent(this, {
            type: "point",
            color: new pc.Color(1, 1, 0),
            radius: 10
        });
    };
    Star = pc.inherits(Star, game.entity.Planet);

    return {
        Star: Star
    };
} ());
