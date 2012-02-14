# backbone-factory.js

backbone-factory.js is a JavaScript module that allows you to create instances of Backbone models from templates in a repeatable way.

## Requirements

* [Underscore.js](http://documentcloud.github.com/underscore/)
* [Backbone.js](http://documentcloud.github.com/backbone/)

## Usage

### Backbone.Factory.define(name, [options], callback)

Define a new factory with the given name and callback.

    Backbone.Factory.define("student", function() {
      return {
        name: "John",
        age: 21
      };
    });

A factory may declare a parent factory from which properties should be inherited.

    Backbone.Factory.define("freshman", {parent: "person"}, function() {
      return {
        age: 18
      };
    });

A factory may also declare an existing Backbone model to use for instantiation.

    Backbone.Factory.define("person", {model: Person}, function() {
      return {
        name: "John"
      };
    });

    var person = Backbone.Factory.create("person");

    person; //=> new Person()

### Backbone.Factory.create(name, [options])

Create a new object using the factory with the given name.

    var student = Backbone.Factory.create("student");

    student;      //=> new Backbone.Model()

    student.name; //=> "John"
    student.age;  //=> 21

You can pass an optional set of properties which will override the factory defaults.

    var bob = Backbone.Factory.create("student", {name: "Bob"});

    bob.name; //=> "Bob"
    bob.age;  //=> 21

### Backbone.Factory.sequence(name, [callback])

Define a sequence that may be iterated upon.

    Backbone.Factory.sequence("email", function(n) {
      return "test+" + n + "@example.com";
    });

Sequences without a callback function will simply return the next integer in the sequence.

Sequences may also be scoped to a factory definition. These sequences will only be available within that factory. Every
object created by the factory will automatically include the next iteration in the sequence.

    Backbone.Factory.define("user", function() {
      return {
        email: this.sequence(function(n) {
          return "test+" + n + "@example.com";
        })
      };
    });

    Backbone.Factory.create("user").email; //=> "test+1@example.com"
    Backbone.Factory.create("user").email; //=> "test+2@example.com"
    Backbone.Factory.create("user").email; //=> "test+3@example.com"

### Backbone.Factory.next(name)

Return the next iteration in the sequence.

    Backbone.Factory.next("email"); //=> "test+1@example.com"
    Backbone.Factory.next("email"); //=> "test+2@example.com"
    Backbone.Factory.next("email"); //=> "test+3@example.com"

## License

backbone-factory.js is available under the MIT license.
