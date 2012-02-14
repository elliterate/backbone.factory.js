Backbone.Factory = (function() {
  var Factory, factories, sequences;

  function initialize() {
    factories = {};
    sequences = {};
  }

  Factory = function(options, callback) {
    var self = {},
      count = 0,
      builder = {};

    options = options || {};

    builder.sequence = function(callback) {
      return callback ? callback(count) : count;
    };

    self.options = function() {
      if (options.parent) {
        return _(factories[options.parent].options()).extend(options);
      } else {
        return _(options).clone();
      }
    };

    self.attributes = function(overrides) {
      var attributes;

      attributes = callback.call(builder);

      if (options.parent) {
        attributes = factories[options.parent].attributes(attributes);
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

  Factory.sequence = function(name, sequence) {
    sequences[name] = {
      count: 0,
      callback: sequence
    };
  };

  Factory.next = function(name) {
    var sequence = sequences[name];

    sequence.count += 1;

    return sequence.callback ? sequence.callback(sequence.count) : sequence.count;
  };

  Factory.reset = function() {
    initialize();
  };

  initialize();

  return Factory;
}());
