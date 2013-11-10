define(["jQuery", "Eventable"], function($, Eventable){

  // Global defaults and config options

  return {
    DEBUG: false,
    SKIP_VALIDATION: false,
    LANGUAGE: "en",

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

    version: "0.3.0",
    instances: [],

    EventBus: _.extend({}, Eventable),

    /* We need a form handler here to handle all the form submits */
    setDefaults: function(options) {
      this.DEFAULTS = _.extend(this.DEFAULTS, options || {});
    }
  };

  /*
   Define default attributes that can be extended through an object passed to the
   initialize function of SirTrevor
  */


  // SirTrevor.BlockMixins = {};
  // SirTrevor.Blocks = {};
  // SirTrevor.Formatters = {};



  // var formBound = false; // Flag to tell us once we've bound our submit event

  // SirTrevor.bindFormSubmit = function(form) {
  //   if (!formBound) {
  //     SirTrevor.submittable();
  //     form.bind('submit', this.onFormSubmit);
  //     formBound = true;
  //   }
  // };

  // SirTrevor.onBeforeSubmit = function(should_validate) {
  //   // Loop through all of our instances and do our form submits on them
  //   var errors = 0;
  //   _.each(SirTrevor.instances, function(inst, i) {
  //     errors += inst.onFormSubmit(should_validate);
  //   });
  //   SirTrevor.log("Total errors: " + errors);

  //   return errors;
  // };

  // SirTrevor.onFormSubmit = function(ev) {
  //   var errors = SirTrevor.onBeforeSubmit();

  //   if(errors > 0) {
  //     SirTrevor.EventBus.trigger("onError");
  //     ev.preventDefault();
  //   }
  // };

  // SirTrevor.setBlockOptions = function(type, options) {
  //   var block = SirTrevor.Blocks[type];

  //   if (_.isUndefined(block)) {
  //     return;
  //   }

  //   _.extend(block.prototype, options || {});
  // };

  // SirTrevor.runOnAllInstances = function(method) {
  //   if (_.has(SirTrevor.Editor.prototype, method)) {
  //     // augment the arguments pseudo array and pass on to invoke()
  //     // this allows us to pass arguments on to the target methods
  //     [].unshift.call(arguments, SirTrevor.instances);
  //     _.invoke.apply(_, arguments);
  //   } else {
  //     SirTrevor.log("method doesn't exist");
  //   }
  // };

  // return SirTrevor;

});