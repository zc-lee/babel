"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es7.promise.finally");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.array.map");

var _console;

var arr = [1, 2, 3];
arr.map(function (v) {
  return v * 2;
});

(_console = console).log.apply(_console, arr);

var fn = function fn() {
  return 1;
}; // ES6箭头函数, 返回值为1


var num = Math.pow(3, 2); // ES7求幂运算符

var hasTwo = [1, 2, 3].includes(2);

var foo = function foo(a, b, c) {
  // ES7参数支持尾部逗号
  console.log('a:', a);
  console.log('b:', b);
  console.log('c:', c);
};

foo(1, 3, 4);
Promise.resolve()["finally"]();
console.log(fn());
console.log(num);
console.log(hasTwo);