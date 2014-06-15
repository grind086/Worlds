pc.extend(game.dialogue, function() {
    var Node = function (obj, entities) {
        // Setup entity references
        if (obj.hasOwnProperty('entities')) {
            for (var e in obj.entities) {
                if (obj.entities.hasOwnProperty(e)) {
                    obj.entities[e] = entities[obj.entities[e]];
                }
            }
        } else {
            obj[k].entities = entities;
        }

        this.data = obj.data;
        this.choices = obj.choices;
    };

    return {
        Node: Node
    };
} ());
