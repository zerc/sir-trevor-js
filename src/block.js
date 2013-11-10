define(["jQuery","_", "logger", "simple-block", "block.validations", "spin"],

  function($, _, SimpleBlock, BlockValidations, Spinner){

    var Block = function(data, instance_id) {
      SimpleBlock.apply(this, arguments);
    };

    var delete_template = _.template(delete_template)({
      'delete': i18n.t("general:delete")
    });

    var drop_options = {
      html: _.template(drop_template)({
        title: i18n.t('general:drop',
          {block: '<span><%= block.title() %></span>'}),
        name: _.result(block, "icon_name")
      }),
      re_render_on_reorder: false
    };

    var upload_options = {
      html: _.template(upload_template)({upload: i18n.t('general:upload')})
    };

    SirTrevor.DEFAULTS.Block = {
      drop_options: drop_options,
      paste_options: paste_options,
      upload_options: upload_options
    };

    _.extend(Block.prototype, SimpleBlock.fn, BlockValidations, {

      bound: ["_handleContentPaste", "_onFocus", "_onBlur", "onDrop", "onDeleteClick",
              "clearInsertedStyles", "getSelectionForFormatter"],

      className: 'st-block st-icon--add',

      attributes: function() {
        return _.extend(SimpleBlock.fn.attributes.call(this), {
          'data-icon-after' : "add"
        });
      },

      icon_name: 'default',

      validationFailMsg: function() {
        return i18n.t('errors:validation_fail', { type: this.title() });
      },

      editorHTML: '<div class="st-block__editor"></div>',

      toolbarEnabled: true,

      droppable: false,
      pastable: false,
      uploadable: false,
      fetchable: false,
      ajaxable: false,

      drop_options: {},
      paste_options: {},
      upload_options: {},

      formattable: true,

      _previousSelection: '',

      initialize: function() {},

      toMarkdown: function(markdown){ return markdown; },
      toHTML: function(html){ return html; },

      withMixin: function(mixin) {
        if (!_.isObject(mixin)) { return; }

        var initializeMethod = "initialize" + mixin.mixinName;

        if (_.isUndefined(this[initializeMethod])) {
          _.extend(this, mixin);
          this[initializeMethod]();
        }
      },

      enableBlockMixins : function(name) {
        if (this[name]) {
          this.withMixin(BlockMixins[_.titleize(name)]);
        }
      },

      render: function() {
        this.beforeBlockRender();
        this._setBlockInner();

        this.$editor = this.$inner.children().first();

        if(this.droppable || this.pastable || this.uploadable) {
          var input_html = $("<div>", { 'class': 'st-block__inputs' });
          this.$inner.append(input_html);
          this.$inputs = input_html;
        }

        this._initTextBlocks();

        _.each(["droppable", "pastable", "uploadable", "fetchable"],
          this.enableBlockMixins, this);

        this._initFormatting();
        this._blockPrepare();
        this.onBlockRender();

        return this;
      },

      remove: function() {
        this.$el.remove();
      },

      loading: function() {
        if(!_.isUndefined(this.spinner)) { this.ready(); }

        this.spinner = new Spinner(SirTrevor.DEFAULTS.spinner);
        this.spinner.spin(this.$el[0]);

        this.$el.addClass('st--is-loading');
      },

      ready: function() {
        this.$el.removeClass('st--is-loading');
        if (!_.isUndefined(this.spinner)) {
          this.spinner.stop();
          delete this.spinner;
        }
      },

      /*
        Generic toData implementation.
        Can be overwritten, although hopefully this will cover most situations
      */
      toData: function() {
        SirTrevor.log("toData for " + this.blockID);

        var bl = this.$el,
            dataObj = {};

        /* Simple to start. Add conditions later */
        if (this.hasTextBlock()) {
          var content = this.getTextBlock().html();
          if (content.length > 0) {
            dataObj.text = SirTrevor.toMarkdown(content, this.type);
          }
        }

        // Add any inputs to the data attr
        if(this.$(':input').not('.st-paste-block').length > 0) {
          this.$(':input').each(function(index,input){
            if (input.getAttribute('name')) {
              dataObj[input.getAttribute('name')] = input.value;
            }
          });
        }

        // Set
        if(!_.isEmpty(dataObj)) {
          this.setData(dataObj);
        }
      },

      /* Generic implementation to tell us when the block is active */
      focus: function() {
        this.getTextBlock().focus();
      },

      blur: function() {
        this.getTextBlock().blur();
      },

      onFocus: function() {
        this.getTextBlock().bind('focus', this._onFocus);
      },

      onBlur: function() {
        this.getTextBlock().bind('blur', this._onBlur);
      },

      /*
      * Event handlers
      */

      _onFocus: function() {
        this.trigger('blockFocus', this.$el);
      },

      _onBlur: function() {},

      onDrop: function(dataTransferObj) {},

      onDeleteClick: function(ev) {
        ev.preventDefault();

        var onDeleteConfirm = function(e) {
          e.preventDefault();
          this.trigger('removeBlock', this.blockID);
        };

        var onDeleteDeny = function(e) {
          e.preventDefault();
          this.$el.removeClass('st-block--delete-active');
          $delete_el.remove();
        };

        if (this.isEmpty()) {
          onDeleteConfirm.call(this, new Event('click'));
          return;
        }

        this.$inner.append(delete_template);
        this.$el.addClass('st-block--delete-active');

        var $delete_el = this.$inner.find('.st-block__ui-delete-controls');

        this.$inner.on('click', '.st-block-ui-btn--confirm-delete',
                        _.bind(onDeleteConfirm, this))
                   .on('click', '.st-block-ui-btn--deny-delete',
                        _.bind(onDeleteDeny, this));
      },

      pastedMarkdownToHTML: function(content) {
        return SirTrevor.toHTML(SirTrevor.toMarkdown(content, this.type), this.type);
      },

      onContentPasted: function(event, target){
        target.html(this.pastedMarkdownToHTML(target[0].innerHTML));
        this.getTextBlock().caretToEnd();
      },

      beforeLoadingData: function() {
        this.loading();

        if(this.droppable || this.uploadable || this.pastable) {
          this.$editor.show();
          this.$inputs.hide();
        }

        SirTrevor.SimpleBlock.fn.beforeLoadingData.call(this);

        this.ready();
      },

      _handleContentPaste: function(ev) {
        var target = $(ev.currentTarget);

        _.delay(_.bind(this.onContentPasted, this, ev, target), 0);
      },

      _getBlockClass: function() {
        return 'st-block--' + this.className;
      },

      /*
      * Init functions for adding functionality
      */

      _initUIComponents: function() {

        var positioner = new SirTrevor.BlockPositioner(this.$el, this.instanceID);

        this._withUIComponent(
          positioner, '.st-block-ui-btn--reorder', positioner.toggle
        );

        this._withUIComponent(
          new SirTrevor.BlockReorder(this.$el)
        );

        this._withUIComponent(
          new SirTrevor.BlockDeletion(), '.st-block-ui-btn--delete', this.onDeleteClick
        );

        this.onFocus();
        this.onBlur();
      },

      _initFormatting: function() {
        // Enable formatting keyboard input
        if (!this.formattable) { return; }
        var formatter;
        for (var name in SirTrevor.Formatters) {
          if (SirTrevor.Formatters.hasOwnProperty(name)) {
            formatter = SirTrevor.Formatters[name];
            if (!_.isUndefined(formatter.keyCode)) {
              formatter._bindToBlock(this.$el);
            }
          }
        }
      },

      _initTextBlocks: function() {
        if (!this.hasTextBlock) { return; }
        this.getTextBlock()
          .bind('paste', this._handleContentPaste)
          .bind('keyup', this.getSelectionForFormatter)
          .bind('mouseup', this.getSelectionForFormatter)
          .bind('DOMNodeInserted', this.clearInsertedStyles);
      },

      getSelectionForFormatter: function() {
        _.defer(function(){
          var selection = window.getSelection(),
             selectionStr = selection.toString().trim();

          if (selectionStr === '') {
            SirTrevor.EventBus.trigger('formatter:hide');
          } else {
            SirTrevor.EventBus.trigger('formatter:positon');
          }
        });
       },

      clearInsertedStyles: function(e) {
        var target = e.target;
        target.removeAttribute('style'); // Hacky fix for Chrome.
      },

      hasTextBlock: function() {
        return this.getTextBlock().length > 0;
      },

      getTextBlock: function() {
        if (_.isUndefined(this.text_block)) {
          this.text_block = this.$('.st-text-block');
        }

        return this.text_block;
      },

      isEmpty: function() {
        return _.isEmpty(this.saveAndGetData());
      }

    });

    Block.extend = extend; // Allow our Block to be extended.

    return Block;
  }
)();