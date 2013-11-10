define(["_", "sir-trevor"], function(_, SirTrevor){
  if (_.isUndefined(console) && !SirTrevor.DEBUG) {
    return function() {};
  }
  return function(message) {
    console.log(message);
  };
});