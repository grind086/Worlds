setTimeout(function() {
    function ScriptLoader() {
        this.timeout = 500;
        this.gameurl = 'contrib/game.js';
        this.depurl = 'dependencies.txt';

        this.MODE_NORMAL = 'normal';
        this.MODE_MULTI = 'multi';
        this.MODE_ERROR = 'error';

        this.SCRIPT_NEW = 'new';
        this.SCRIPT_SUCCESS = 'success';
        this.SCRIPT_FAILURE = 'failure';

        this.mode = this.MODE_NORMAL;
        this.request(this.gameurl, null, this.loadDependencies);
    }

    ScriptLoader.prototype = {
        request: function(url, succb, errcb) {
            var self = this;

            var head = document.getElementsByTagName('head')[0];
            if (!head) {
                pc.log.error("Unable to find DOM head element");
                return;
            }

            var script = document.createElement('script');
            script.setAttribute('data-loaded', self.SCRIPT_NEW);

            var onSuccess = function() {
                if (script.getAttribute('data-loaded') === self.SCRIPT_FAILURE) {
                    pc.log.warning(script.src + " loaded after timing out");
                    return;
                }
                script.setAttribute('data-loaded', self.SCRIPT_SUCCESS);

                if (typeof succb == 'function') {
                    succb.call(self);
                }
            };

            var onError = function() {
                if (script.getAttribute('data-loaded') === self.SCRIPT_SUCCESS) return;
                script.setAttribute('data-loaded', self.SCRIPT_FAILURE);

                if (typeof errcb == 'function') {
                    pc.log.warning(script.src + " timed out");
                    errcb.call(self);
                }
            };

            script.onload = onSuccess;
            script.src = url;
            head.appendChild(script);
            setTimeout(onError, this.timeout);
        },

        loadDependencies: function() {
            pc.log.info("Attempting to load unbuilt game files");
            this.mode = this.MODE_MULTI;

            // Use playcanvas' AJAX functions
            var self = this;
            pc.net.http.request("GET", this.depurl, {
                success: function(response) {
                    pc.log.debug("\n"+response);

                    var files = response.split('\n');
                    self.loadDependency(files, 0);
                },

                error: function(status) {
                    pc.log.error("Unable to load dependencies: " + status);
                    self.mode = self.MODE_ERROR;
                }
            })
        },

        loadDependency: function(list, index) {
            if (index === undefined) index = 0;

            var self = this;
            if (index < list.length) {
                this.request(list[index], function() {
                    pc.log.info("Loaded: " + list[index]);
                    self.loadDependency(list, index + 1);
                }, function() {
                    pc.log.error("Unable to find game files.");
                });
            } else {
                pc.log.info("All dependencies loaded.");

                // Add debug information to the game object
                pc.extend(game.debugInfo, function() {
                    var data = {};
                    var keys = Object.keys(self);

                    for (var i = 0; i < keys.length; i++) {
                        data[keys[i]] = self[keys[i]];
                    }

                    return {
                        ScriptLoader: data
                    };
                } ());
            }
        }
    };

    new ScriptLoader();
}, 0);
