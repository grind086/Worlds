pc.extend(pc.fw, function () {
    /**
     * @name pc.fw.OrbitComponentSystem
     * @constructor Create a new OrbitComponentSystem.
     * @class An Orbit Component is used to create simple orbital motion.
     * @param {pc.fw.ApplicationContext} context The application context.
     * @extends pc.fw.ComponentSystem
     */
    var OrbitComponentSystem = function (context) {
        this.id = 'orbit';
        this.description = "Causes the entity to orbit its parent.";
        context.systems.add(this.id, this);

        this.ComponentType = pc.fw.OrbitComponent;
        this.DataType = pc.fw.OrbitComponentData;

        this.schema = [{
            name: "enabled",
            displayName: "Enabled",
            description: "Enable or disable the orbiter",
            type: "boolean",
            defaultValue: false
        }, {
            name: "radius",
            displayName: "Radius",
            description: "The distance at which the entity will orbit, measured from the parent entity's center",
            type: "number",
            defaultValue: 10,
            options: {
                min: 0
            }
        }, {
            name: "eccentricity",
            displayName: "Eccentricity",
            description: "The deviation of the orbit from a perfect circle",
            type: "number",
            defaultValue: 0,
            options: {
                min: 0,
                max: 1
            }
        }, {
            name: "speed",
            displayName: "Speed",
            description: "The speed at which the entity will orbit",
            type: "number",
            defaultValue: 1
        }, {
            name: "angle",
            description: "The orbiter's current angle",
            defaultValue: 0,
            exposed: false
        },  {
            name: "periapsis",
            exposed: false
        }, {
            name: "apoapsis",
            exposed: false
        }];

        this.exposeProperties();

        this.on('remove', this.onRemove, this);
        pc.fw.ComponentSystem.on("update", this.onUpdate, this);
    };
    OrbitComponentSystem = pc.inherits(OrbitComponentSystem, pc.fw.ComponentSystem);

    var once = true;
    pc.extend(OrbitComponentSystem.prototype, {
        initializeComponentData: function (component, data, properties) {
            properties = ['enabled', 'radius', 'eccentricity', 'speed', 'angle'];
            OrbitComponentSystem._super.initializeComponentData.call(this, component, data, properties);
        },

        /**
         * @private
         * @function
         * @name pc.fw.OrbitComponentSystem#onUpdate
         * @description Handler for the 'update' event which is fired every frame
         * @param {Number} dt The time delta since the last update in seconds
         */
        onUpdate: function (dt) {
            var item;
            var angle;
            for (var key in this.dataStore) {
                if (this.dataStore.hasOwnProperty(key)) {
                    item = this.dataStore[key];
                    if (item && item.data.enabled && item.entity.enabled) {
                        angle = item.data.angle + item.data.speed * dt;
                        if (angle > 2 * Math.PI) {
                            angle -= 2 * Math.PI;
                        }
                        item.data.angle = angle;

                        item.entity.setLocalPosition(
                            item.data.periapsis * Math.sin(angle),
                            0,
                            item.data.apoapsis * Math.cos(angle)
                        );
                    }
                }
            }
        },

        onRemove: function (entity, data) {
        }
    });

    return {
        OrbitComponentSystem: OrbitComponentSystem
    };
}());


