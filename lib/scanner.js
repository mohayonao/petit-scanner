"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

module.exports = (function () {
  var _class = function () {
    var str = arguments[0] === undefined ? "" : arguments[0];
    this.str = String(str);
    this.len = str.length;
    this.pos = 0;
    this.lineNumber = this.len ? 1 : 0;
    this.lineStart = 0;
  };

  _prototypeProperties(_class, null, {
    hasNext: {
      value: function hasNext() {
        return this.pos < this.len;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    peek: {
      value: function peek() {
        return this.str.charAt(this.pos);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    next: {
      value: function next() {
        return this.str.charAt(this.pos++);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    match: {
      value: function match(matcher) {
        return matcher.test ? matcher.test(this.str.charAt(this.pos)) : this.str.charAt(this.pos) === matcher;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    expect: {
      value: function expect(matcher) {
        if (this.match(matcher)) {
          this.pos += 1;
        } else {
          this.throwUnexpectedToken();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    scan: {
      value: function scan(matcher) {
        var result = "";

        if (typeof matcher === "string") {
          var substr = this.str.substr(this.pos, matcher.length);
          if (substr === matcher) {
            result = substr;
          }
        } else {
          var matched = matcher.exec(this.str.substr(this.pos));
          if (matched && matched.index === 0) {
            result = matched[0];
          }
        }

        this.pos += result.length;

        return result;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    skipComment: {
      value: function skipComment() {
        while (this.hasNext()) {
          var ch1 = this.str.charCodeAt(this.pos);
          var ch2 = this.str.charCodeAt(this.pos + 1);

          if (ch1 === 32 || ch1 === 9) {
            this.pos += 1;
          } else if (ch1 === 10) {
            this.pos += 1;
            this.lineNumber += 1;
            this.lineStart = this.pos;
          } else if (ch1 === 47 && ch2 === 47) {
            this.skipSingleLineComment();
          } else if (ch1 === 47 && ch2 === 42) {
            this.skipMultiLineComment();
          } else {
            break;
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    skipSingleLineComment: {
      value: function skipSingleLineComment() {
        this.pos += 2;

        while (this.hasNext()) {
          if (this.str.charCodeAt(this.pos++) === 10) {
            this.lineNumber += 1;
            this.lineStart = this.pos;
            break;
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    skipMultiLineComment: {
      value: function skipMultiLineComment() {
        var depth = 1;

        this.pos += 2;

        while (this.hasNext()) {
          var ch1 = this.str.charCodeAt(this.pos++);
          var ch2 = this.str.charCodeAt(this.pos);

          if (ch1 === 10) {
            this.lineNumber += 1;
            this.lineStart = this.pos;
          } else if (ch1 === 47 && ch2 === 42) {
            this.pos += 1;
            ++depth;
          } else if (ch1 === 42 && ch2 === 47) {
            this.pos += 1;
            if (--depth === 0) {
              this.pos += 1;
              return;
            }
          }
        }

        this.throwUnexpectedToken();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    throwUnexpectedToken: {
      value: function throwUnexpectedToken() {
        var ch = this.peek();
        var msg = "Unexpected token" + (ch ? ": '" + ch + "'" : " ILLEGAL");
        var err = new SyntaxError(msg);

        err.index = this.pos;
        err.lineNumber = this.lineNumber;
        err.column = this.pos - this.lineStart + (ch ? 1 : 0);

        throw err;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return _class;
})();