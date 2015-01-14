"use strict";

/*
  Block Quote
*/

var Block = require('../block');
var stToHTML = require('../to-html');

module.exports = Block.extend({

  type: "quote",

  title: function() { return i18n.t('blocks:quote:title'); },

  icon_name: 'quote',

  editorHTML: function() {
    return require('../templates/blocks/quote.tpl');
  },

  loadData: function(data){
    this.getTextBlock().html(stToHTML(data.text, this.type));
    this.$('.js-cite-input').val(data.cite);
  },

  toMarkdown: function(markdown) {
    return markdown.replace(/^(.+)$/mg,"> $1");
  }

});
