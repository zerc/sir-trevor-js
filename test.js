(function () {
var main = function ($, Eventable) {
        return {
            DEBUG: false,
            SKIP_VALIDATION: false,
            LANGUAGE: 'en',
            DEFAULTS: {
                defaultType: false,
                spinner: {
                    className: 'st-spinner',
                    lines: 9,
                    length: 8,
                    width: 3,
                    radius: 6,
                    color: '#000',
                    speed: 1.4,
                    trail: 57,
                    shadow: false,
                    left: '50%',
                    top: '50%'
                },
                blockLimit: 0,
                blockTypeLimits: {},
                required: [],
                uploadUrl: '/attachments',
                baseImageUrl: '/sir-trevor-uploads/',
                errorsContainer: undefined
            },
            version: '0.3.0',
            instances: [],
            EventBus: _.extend({}, Eventable),
            boom: function () {
                console.log(this);
            }
        };
    }(jQuery, Eventable);}());