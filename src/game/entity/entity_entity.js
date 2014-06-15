/**
 * @name game.entity
 * @namespace Game entities
 * @description Creates all in-game objects, light sources and cameras
 */
game.entity = function () {
    /**
     * @name game.entity.Entity
     * @class Base class for game entities
     */
    var Entity = function() {};
    Entity = pc.inherits(Entity, pc.fw.Entity);

    Entity.prototype = {

    };

    return {
        Entity: Entity,
        /**
         * @enum {String}
         * @name game.entity.Type
         * @description Type names for different entities
         */
        Type: {}
    }
} ();
