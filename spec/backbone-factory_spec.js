describe("Backbone.Factory", function() {
  var Person;

  beforeEach(function() {
    Person = Backbone.Model.extend({
      getName: function() {
        return this.get("name");
      }
    });
  });

  describe(".define", function() {
    it("should define a factory that can be created with .create", function() {
      Backbone.Factory.define("person", function() {
        return {
          name: "John",
          age: 25
        };
      });

      var person = Backbone.Factory.create("person");

      expect(person.get("name")).toEqual("John");
      expect(person.get("age")).toEqual(25);
    });

    it("should define a factory that generates the optional model", function() {
      Backbone.Factory.define("person", {model: Person}, function() {
        return {
          name: "John",
          age: 25
        };
      });

      var person = Backbone.Factory.create("person");

      expect(person.getName()).toEqual("John");
    });

    describe("with a parent factory", function() {
      it("should inherit the default attributes", function() {
        Backbone.Factory.define("student", function() {
          return {
            name: "John",
            age: 21
          }
        });

        Backbone.Factory.define("freshman", {parent: "student"}, function() {
          return {
            age: 18
          }
        });

        var student = Backbone.Factory.create("freshman");

        expect(student.get("name")).toEqual("John");
        expect(student.get("age")).toEqual(18);
      });

      it("should inherit the parent model", function() {
        Backbone.Factory.define("student", {model: Person}, function() {
          return {
            name: "John",
            age: 21
          }
        });

        Backbone.Factory.define("freshman", {parent: "student"}, function() {
          return {
            age: 18
          }
        });

        var student = Backbone.Factory.create("freshman");

        expect(student.getName()).toEqual("John");
      });
    });

    describe("this.sequence", function() {
      it("should define a local sequence that will iterate with each .create", function() {
        Backbone.Factory.define("user", function() {
          return {
            email: this.sequence(function(n) {
              return "user+" + n + "@example.com";
            })
          };
        });

        Backbone.Factory.define("admin", function() {
          return {
            email: this.sequence(function(n) {
              return "admin+" + n + "@example.com";
            })
          };
        });

        expect(Backbone.Factory.create("user").get("email")).toEqual("user+1@example.com");
        expect(Backbone.Factory.create("user").get("email")).toEqual("user+2@example.com");
        expect(Backbone.Factory.create("user").get("email")).toEqual("user+3@example.com");

        expect(Backbone.Factory.create("admin").get("email")).toEqual("admin+1@example.com");
        expect(Backbone.Factory.create("admin").get("email")).toEqual("admin+2@example.com");

        expect(Backbone.Factory.create("user").get("email")).toEqual("user+4@example.com");
        expect(Backbone.Factory.create("user").get("email")).toEqual("user+5@example.com");

        expect(Backbone.Factory.create("admin").get("email")).toEqual("admin+3@example.com");
      });
    });

    describe("when no callback is given", function() {
      beforeEach(function() {
        Backbone.Factory.define("record", function() {
          return {
            id: this.sequence()
          };
        });
      });

      it("should return the next integer in the sequence", function() {
        expect(Backbone.Factory.create("record").id).toEqual(1);
        expect(Backbone.Factory.create("record").id).toEqual(2);
        expect(Backbone.Factory.create("record").id).toEqual(3);
      });
    });
  });

  describe(".create", function() {
    beforeEach(function() {
      Backbone.Factory.define("person", function() {
        return {
          name: "John",
          age: 25
        }
      });
    });

    it("should override the defaults with the given options", function() {
      var person = Backbone.Factory.create("person", {name: "Bob"});

      expect(person.get("name")).toEqual("Bob");
      expect(person.get("age")).toEqual(25);
    });
  });

  describe(".sequence", function() {
    it("should define a sequence that can be iterated with .next", function() {
      Backbone.Factory.sequence("email", function(n) {
        return "test+" + n + "@example.com";
      });

      expect(Backbone.Factory.next("email")).toEqual("test+1@example.com");
      expect(Backbone.Factory.next("email")).toEqual("test+2@example.com");
      expect(Backbone.Factory.next("email")).toEqual("test+3@example.com");
    });
  });

  describe(".next", function() {
    beforeEach(function() {
      Backbone.Factory.sequence("foo", function(n) {
        return n;
      });

      Backbone.Factory.sequence("bar", function(n) {
        return n;
      });
    });

    it("should increment sequences separately", function() {
      expect(Backbone.Factory.next("foo")).toEqual(1);
      expect(Backbone.Factory.next("foo")).toEqual(2);
      expect(Backbone.Factory.next("foo")).toEqual(3);

      expect(Backbone.Factory.next("bar")).toEqual(1);
      expect(Backbone.Factory.next("bar")).toEqual(2);

      expect(Backbone.Factory.next("foo")).toEqual(4);
      expect(Backbone.Factory.next("foo")).toEqual(5);

      expect(Backbone.Factory.next("bar")).toEqual(3);
    });

    describe("when the sequence was defined without a callback", function() {
      beforeEach(function() {
        Backbone.Factory.sequence("id");
      });

      it("should return the next integer in the sequence", function() {
        expect(Backbone.Factory.next("id")).toEqual(1);
        expect(Backbone.Factory.next("id")).toEqual(2);
        expect(Backbone.Factory.next("id")).toEqual(3);
      });
    });
  });
});
