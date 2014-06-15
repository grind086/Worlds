game.dialogue = function () {
    var Dialogue = function(json) {
        this.data = JSON.parse(json);
        this.entities = Array.prototype.slice.call(arguments, 1);
        this.index = [];
        this.node = null;

        this.populate(this.data);
    };

    Dialogue.prototype = {
        populate: function(obj) {
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    // Nodes are capitalized, branches are not
                    if (k.charAt(0) === k.charAt(0).toUpperCase()) {
                        // Create the node
                        obj[k] = new game.dialogue.Node(obj[k], this.entities);
                    }
                    else {
                        // Recursion!
                        this.populate(obj[k]);
                    }
                }
            }
        },

        execute: function (choice) {
            if (this.node.choices.hasOwnProperty(choice)) {
                var choiceObj = this.node.choices[choice];

                if (choiceObj.hasOwnProperty('callback')) {
                    choiceObj.callback.call(this)
                }
            }
        },

        goToIndex: function (index) {
            var obj = this.data;
            for (var i = 0; i < index.length; i++) {
                if (!obj.hasOwnProperty(index[i])) {
                    return false;
                }
                obj = obj[index[i]];
            }
            if (!obj instanceof game.dialogue.Node) {
                return false;
            }
            this.index = index;
            this.node = obj;
            return true;
        }
    };

    return {
        Dialogue: Dialogue
    }
} ();


a = {
    angry: {
        Furious: {
            entities: {
                Fred: 0
            },
            choices: {

            },
            data: [
                {
                    speaker: 'Fred'
                }
            ]
        }
    }
};
