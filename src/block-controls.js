/*
  SirTrevor Block Controls
  --
  Gives an interface for adding new Sir Trevor blocks.
*/

define(

  ["jQuery", "_", "function-bind", "renderable", "Eventable", "blocks",
    "block-control", "text!templates/close"],

  function($, _, FunctionBind, Renderable, Eventable, Blocks,
    BlockControl, close){

    var BlockControls = function(available_types, instance_scope) {
      this.instance_scope = instance_scope;
      this.available_types = available_types || [];
      this._ensureElement();
      this._bindFunctions();
      this.initialize();
    };

    _.extend(BlockControls.prototype, FunctionBind, Renderable, Eventable, {

      bound: ['handleControlButtonClick'],
      block_controls: null,

      className: "st-block-controls",

      html: _.template(close)({close: i18n.t("general:close")}),

      initialize: function() {
        for(var block_type in this.available_types) {
          if (Blocks.hasOwnProperty(block_type)) {
            var block_control = new BlockControl(block_type, this.instance_scope);
            if (block_control.can_be_rendered) {
              this.$el.append(block_control.render().$el);
            }
          }
        }

        this.$el.on('click', '.st-block-control', this.handleControlButtonClick);
      },

      show: function() {
        this.$el.addClass('st-block-controls--active');
      },

      hide: function() {
        this.$el.removeClass('st-block-controls--active');
      },

      handleControlButtonClick: function(e) {
        e.stopPropagation();
        this.trigger('createBlock', $(e.currentTarget).attr('data-type'));
      }

    });

    return BlockControls;
  }
);


