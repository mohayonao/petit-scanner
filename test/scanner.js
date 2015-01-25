"use strict";

import assert from "power-assert";
import sinon from "sinon";
import Scanner from "../lib/scanner";

describe("Scanner", () => {
  describe("constructor", () => {
    it("(str: string)", () => {
      var scanner = new Scanner("");

      assert(scanner instanceof Scanner);
    });
  });
  describe("hasNext", () => {
    it("(): boolean", () => {
      var scanner = new Scanner("");

      assert(typeof scanner.hasNext() === "boolean");
    });
  });
  describe("peek", () => {
    it("(): string", () => {
      var scanner = new Scanner("ABC");

      assert(scanner.peek() === "A");
      assert(scanner.peek() === "A");
    });
  });
  describe("next", () => {
    it("(): string", () => {
      var scanner = new Scanner("ABC");

      assert(scanner.hasNext() === true);
      assert(scanner.next() === "A");

      assert(scanner.hasNext() === true);
      assert(scanner.next() === "B");

      assert(scanner.hasNext() === true);
      assert(scanner.next() === "C");

      assert(scanner.hasNext() === false);
      assert(scanner.next() === "");
    });
  });
  describe("match", () => {
    it("(matcher: string|RegExp): boolean", () => {
      var scanner = new Scanner("ABC");

      assert(scanner.match("A") === true);
      assert(scanner.match("B") === false);
      assert(scanner.match("a") === false);
      assert(scanner.match(/a/i) === true);
    });
  });
  describe("expect", () => {
    it("(matcher: string|RegExp): void", () => {
      var scanner = new Scanner("ABC");

      sinon.stub(scanner, "throwUnexpectedToken", () => {});

      assert(scanner.throwUnexpectedToken.callCount === 0);

      scanner.expect("A");
      assert(scanner.throwUnexpectedToken.callCount === 0);

      scanner.expect("A");
      assert(scanner.throwUnexpectedToken.callCount === 1);

      scanner.expect("B");
      assert(scanner.throwUnexpectedToken.callCount === 1);

      scanner.expect(/c/i);
      assert(scanner.throwUnexpectedToken.callCount === 1);
    });
  });
  describe("scan", () => {
    it("(matcher: RegExp): string", () => {
      var scanner = new Scanner("ABC");

      assert(scanner.scan(/ab/i) === "AB");
      assert(scanner.scan(/ab/i) === "");
      assert(scanner.scan("C") === "C");
      assert(scanner.scan("C") === "");
    });
  });
  describe("skipComment", () => {
    it("(): void", () => {
      var scanner = new Scanner(`
        a
        // comment
        b
        /** /
         * /* nested comment */
         */
        c
        /*
      `);

      sinon.stub(scanner, "throwUnexpectedToken", () => {});

      scanner.skipComment();
      assert(scanner.next() === "a");

      scanner.skipComment();
      assert(scanner.next() === "b");

      scanner.skipComment();
      assert(scanner.next() === "c");

      assert(scanner.throwUnexpectedToken.callCount === 0);

      scanner.skipComment();
      assert(scanner.throwUnexpectedToken.callCount === 1);
    });
  });
  describe("throwUnexpectedToken", () => {
    it("throw SyntaxError", () => {
      var scanner = new Scanner("ABC");

      assert.throws(() => {
        scanner.throwUnexpectedToken();
      }, (e) => {
        return e instanceof SyntaxError &&
          /Unexpected token: 'A'/.test(e) &&
          e.index === 0 &&
          e.lineNumber === 1 &&
          e.column === 1;
      });
    });
    it("throw SyntaxError ILLEGAL", () => {
      var scanner = new Scanner("");

      assert.throws(() => {
        scanner.throwUnexpectedToken();
      }, (e) => {
        return e instanceof SyntaxError &&
        /Unexpected token ILLEGAL/.test(e) &&
        e.index === 0 &&
        e.lineNumber === 0 &&
        e.column === 0;
      });
    });
  });
});
