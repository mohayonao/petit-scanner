"use strict";

export default class {
  constructor(str = "") {
    this.str = String(str);
    this.len = str.length;
    this.pos = 0;
    this.lineNumber = this.len ? 1 : 0;
    this.lineStart = 0;
  }

  /**
   * hasNext
   * @return {boolean}
   * @public
   */
  hasNext() {
    return this.pos < this.len;
  }

  /**
   * peek
   * @return {string}
   * @public
   */
  peek() {
    return this.str.charAt(this.pos);
  }

  /**
   * next
   * @return {string}
   * @public
   */
  next() {
    return this.str.charAt(this.pos++);
  }

  /**
   * match
   * @param {string|RegExp} matcher
   * @return {boolean}
   * @public
   */
  match(matcher) {
    return matcher.test ?
      matcher.test(this.str.charAt(this.pos)) :
      this.str.charAt(this.pos) === matcher;
  }

  /**
   * expect
   * @param {string|RegExp} matcher
   * @throws {SyntaxError}
   * @public
   */
  expect(matcher) {
    if (this.match(matcher)) {
      this.pos += 1;
    } else {
      this.throwUnexpectedToken();
    }
  }

  /**
   * scan
   * @param {string|RegExp} matcher
   * @public
   */
  scan(matcher) {
    var result = "";

    if (typeof matcher === "string") {
      let substr = this.str.substr(this.pos, matcher.length);
      if (substr === matcher) {
        result = substr;
      }
    } else {
      let matched = matcher.exec(this.str.substr(this.pos));
      if (matched && matched.index === 0) {
        result = matched[0];
      }
    }

    this.pos += result.length;

    return result;
  }

  /**
   * skipComment
   * @throws {SyntaxError}
   * @public
   */
  skipComment() {
    while (this.hasNext()) {
      var ch1 = this.str.charCodeAt(this.pos);
      var ch2 = this.str.charCodeAt(this.pos + 1);

      if (ch1 === 0x20 || ch1 === 0x09) { // <SPACE> or <TAB>
        this.pos += 1;
      } else if (ch1 === 0x0a) { // <CR>
        this.pos += 1;
        this.lineNumber += 1;
        this.lineStart = this.pos;
      } else if (ch1 === 0x2f && ch2 === 0x2f) {
        this.skipSingleLineComment();
      } else if (ch1 === 0x2f && ch2 === 0x2a) {
        this.skipMultiLineComment();
      } else {
        break;
      }
    }
  }

  /**
   * skipSingleLineComment
   * @private
   */
  skipSingleLineComment() {
    this.pos += 2; // skip //

    while (this.hasNext()) {
      if (this.str.charCodeAt(this.pos++) === 0x0a) { // <CR>
        this.lineNumber += 1;
        this.lineStart = this.pos;
        break;
      }
    }
  }

  /**
   * skipMultiLineComment
   * @throws {SyntaxError}
   * @private
   */
  skipMultiLineComment() {
    var depth = 1;

    this.pos += 2; // skip /*

    while (this.hasNext()) {
      var ch1 = this.str.charCodeAt(this.pos++);
      var ch2 = this.str.charCodeAt(this.pos);

      if (ch1 === 0x0a) { // <CR>
        this.lineNumber += 1;
        this.lineStart = this.pos;
      } else if (ch1 === 0x2f && ch2 === 0x2a) { // /*
        this.pos += 1;
        ++depth;
      } else if (ch1 === 0x2a && ch2 === 0x2f) { // */
        this.pos += 1;
        if (--depth === 0) {
          this.pos += 1;
          return;
        }
      }
    }

    this.throwUnexpectedToken();
  }

  /**
   * throwUnexpectedToken
   * @throws {SyntaxError}
   * @private
   */
  throwUnexpectedToken() {
    var ch = this.peek();
    var msg = "Unexpected token" + (ch ? (": '" + ch + "'") : " ILLEGAL");
    var err = new SyntaxError(msg);

    err.index = this.pos;
    err.lineNumber = this.lineNumber;
    err.column = this.pos - this.lineStart + (ch ? 1 : 0);

    throw err;
  }
}
