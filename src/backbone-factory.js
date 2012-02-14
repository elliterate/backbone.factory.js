Backbone.Factory = (function() {
  var Factory, Sequence, factories, sequences;

  function initialize() {
    factories = {};
    sequences = {};
  }

  Sequence = function(callback) {
    var self = {},
      count = 0;

    self.next = function() {
      count += 1;

      return callback ? callback(count) : count;
    };

    return self;
  };

  Factory = function(options, callback) {
    var self = {},
      count = 0,
      builder = {};

    options = options || {};

    builder.sequence = function(callback) {
      return callback ? callback(count) : count;
    };

    function hasParent() {
      return !!options.parent;
    }

    function getParent() {
      return factories[options.parent];
    }

    self.options = function() {
      var opts;

      opts = _(options).clone();

      if (hasParent()) {
        _(opts).defaults(getParent().options());
      }

      return opts;
    };

    self.attributes = function(overrides) {
      var attributes;

      attributes = callback.call(builder);

      if (hasParent()) {
        attributes = getParent().attributes(attributes);
      }

      return _(attributes).extend(overrides);
    };

    self.create = function(overrides) {
      var Model;

      count += 1;

      Model = self.options().model || Backbone.Model;

      return new Model(self.attributes(overrides));
    };

    return self;
  };

  Factory.define = function(name) {
    var callback,
      options = {};

    if (arguments.length == 2) {
      callback = arguments[1];
    } else {
      options = arguments[1];
      callback = arguments[2];
    }

    factories[name] = new Factory(options, callback);
  };

  Factory.create = function(name, overrides) {
    var factory = factories[name];

    return factory.create(overrides);
  };

  Factory.sequence = function(name, callback) {
    sequences[name] = new Sequence(callback);
  };

  Factory.next = function(name) {
    var sequence = sequences[name];

    return sequence.next();
  };

  Factory.reset = function() {
    initialize();
  };

  initialize();

  return Factory;
}());
