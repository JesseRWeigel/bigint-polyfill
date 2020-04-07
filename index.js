"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nativeBigInt = typeof global !== 'undefined' && global.BigInt || typeof window !== 'undefined' && window.BigInt;
var supportsNative = typeof nativeBigInt === 'function';

var _BigInt = require('big-integer');

var nativeFunction = function nativeFunction(operator, a) {
  switch (operator) {
    // Arithmetic operators
    case 'add':
      return function (b) {
        return new BigInt(a + b);
      };

    case 'subtract':
      return function (b) {
        return new BigInt(a - b);
      };

    case 'multiply':
      return function (b) {
        return new BigInt(a * b);
      };

    case 'divide':
      return function (b) {
        return new BigInt(a / b);
      };

    case 'remainder':
      return function (b) {
        return new BigInt(a % b);
      };

    case 'pow':
      return function (b) {
        return new BigInt(a ** b);
      };
    // Bitwise shift operators

    case 'shiftLeft':
      return function (b) {
        return new BigInt(a << b);
      };

    case 'shiftRight':
      return function (b) {
        return new BigInt(a >> b);
      };
    // Binary bitwise operators

    case 'and':
      return function (b) {
        return new BigInt(a & b);
      };

    case 'or':
      return function (b) {
        return new BigInt(a | b);
      };

    case 'xor':
      return function (b) {
        return new BigInt(a ^ b);
      };
    // Relational operators

    case 'lt':
      return function (b) {
        return a < b;
      };

    case 'gt':
      return function (b) {
        return a > b;
      };

    case 'leq':
      return function (b) {
        return a <= b;
      };

    case 'geq':
      return function (b) {
        return a >= b;
      };

    case 'eq':
      return function (b) {
        return a === b;
      };

    case 'neq':
      return function (b) {
        return a !== b;
      };
    // Unary operators

    case 'negate':
      return function () {
        return new BigInt(-a);
      };

    case 'not':
      return function () {
        return new BigInt(~a);
      };

    case 'next':
      return function () {
        return new BigInt(++a);
      };

    case 'prev':
      return function () {
        return new BigInt(--a);
      };
  }

  return undefined;
};
/**
 * A proxy for BigInt that supports both native and polyfill implementations.
 * Also includes convenience functions for conversion to and from uint8 arrays
 * with both big and little endian byte order.
 * 
 * Examples:
 *     const biNative = new BigInt(2n ** 63n - 1n));
 *     biNative.toUint8Array()
 * 
 *     const biNonNative = new BigInt('9223372036854775807');
 *     biNonNative.toUint8Array()
 */


var BigInt = /*#__PURE__*/function () {
  function BigInt(value) {
    _classCallCheck(this, BigInt);

    if (typeof value === 'bigint') {
      this.value = value;
    } else if (_instanceof(value, BigInt)) {
      return value;
    } else {
      this.value = new _BigInt(value);
    } // Proxy method calls to _BigInt if possible


    return new Proxy(this, {
      get: function get(obj, field) {
        if (field in obj) return obj[field];
        if (typeof obj.value === 'bigint') return nativeFunction(field, obj.value);
        if (typeof obj.value !== 'bigint' && field in obj.value) return obj.value[field].bind(obj.value);
        return undefined;
      }
    });
  }

  _createClass(BigInt, [{
    key: "valueOf",
    value: function valueOf() {
      if (typeof this.value === 'bigint') {
        return this.value;
      } else {
        throw new Error('Cannot implicitly cast polyfilled BigInt into number');
      }
    }
  }, {
    key: "equals",
    value: function equals(b) {
      if (typeof this.value === 'bigint') {
        return this.value === b.value;
      } else if (_instanceof(b, BigInt)) {
        if (typeof b.value === 'bigint') {
          return this.value.equals(new _BigInt(b.toString()));
        } else {
          return this.value.equals(new _BigInt(b.value));
        }
      } else {
        return this.value.equals(new _BigInt(b));
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.value.toString();
    }
  }, {
    key: "_toUint8ArrayNative",
    value: function _toUint8ArrayNative() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var elements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var arr = new ArrayBuffer(elements);
      var view = new DataView(arr);
      view.setBigUint64(0, this.value, littleEndian);
      return new Uint8Array(arr);
    }
  }, {
    key: "_toUint8Array",
    value: function _toUint8Array() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var elements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
      var arr = new ArrayBuffer(elements);
      var uint8arr = new Uint8Array(arr);
      var intarr = this.value.toArray(2 ** 8).value;
      if (littleEndian) uint8arr.set(intarr.reverse(), 0);else uint8arr.set(intarr, elements - intarr.length);
      return uint8arr;
    }
  }, {
    key: "toUint8Array",
    value: function toUint8Array() {
      var littleEndian = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var elements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

      if (typeof this.value === 'bigint') {
        return this._toUint8ArrayNative(littleEndian, elements);
      } else {
        return this._toUint8Array(littleEndian, elements);
      }
    }
    /**
     * Get BigInt from a uint8 array in specified endianess.
     * Uses native BigInt if the environment supports it and detectSupport is true.
     * 
     * @param {Uint8Array} uint8arr
     * @param {boolean} littleEndian use little endian byte order, default is false
     * @param {boolean} detectSupport auto-detect support for native BigInt, default is true
     */

  }], [{
    key: "fromUint8Array",
    value: function fromUint8Array(uint8arr) {
      var littleEndian = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var detectSupport = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (supportsNative && detectSupport) {
        var view = new DataView(uint8arr.buffer);
        return new BigInt(view.getBigUint64(0, littleEndian));
      }

      var array;

      if (littleEndian) {
        array = Array.from(uint8arr).reverse();
      } else {
        array = Array.from(uint8arr);
      }

      return new BigInt(_BigInt.fromArray(array, 2 ** 8));
    }
  }]);

  return BigInt;
}();

module.exports = BigInt;