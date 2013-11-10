requirejs({
  baseUrl: '../src',
  paths: {
    "_": "../components/underscore/underscore",
    "Eventable": "../components/Eventable/eventable",
    "text": "../components/requirejs-text/text",
    "jQuery": "../components/jquery/jquery",
    "spin": "../components/spinjs/spin",
    'main': 'sir-trevor'
  },
  exclude: [
    "_",
    "Eventable",
    "jQuery",
    "text"
  ],
  shim: {
    '_': {
      exports: '_'
    },
    'Eventable': {
      deps: ['_']
    }
  }
});