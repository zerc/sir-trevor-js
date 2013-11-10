define(

  ["jQuery", "_", "function-bind", "renderable", "Eventable",
    "blocks", "text!templates/icon.ejs"],

  function($, _, FunctionBind, Renderable, Eventable, Blocks, icon){

    var BlockControl = function(type, instance_scope) {
      this.type = type;
      this.instance_scope = instance_scope;
      this.block_type = Blocks[this.type].prototype;
      this.can_be_rendered = this.block_type.toolbarEnabled;

      this._ensureElement();
    };

    _.extend(BlockControl.prototype, FunctionBind, Renderable, Eventable, {

      tagName: 'a',
      className: "st-block-control",

      template : _.template(icon),

      attributes: function() {
        return {
          'data-type': this.block_type.type
        };
      },

      render: function() {
        this.$el.html(this.template({
          name: _.result(this.block_type, 'icon_name'),
          title: _.result(this.block_type, 'title')
        }));
        return this;
      }
    });

    return BlockControl;
  }
);