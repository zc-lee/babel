# babel

[参考资料](https://juejin.im/post/5e477139f265da574c566dda?utm_source=gold_browser_extension)

## 准备

```javascript
mkdir babel
cd babel
npm init -y
mkdir src
cnpm i -D @babel/cli @babel/core
```

src/index.js

```javascript
let arr = [1, 2, 3]
arr.map(v => v * 2)
console.log(...arr)

const fn = () => 1; // ES6箭头函数, 返回值为1
let num = 3 ** 2; // ES7求幂运算符
let hasTwo = [1, 2, 3].includes(2)
let foo = function(a, b, c, ) { // ES7参数支持尾部逗号
    console.log('a:', a)
    console.log('b:', b)
    console.log('c:', c)
}
foo(1, 3, 4)
Promise.resolve().finally();
console.log(fn());
console.log(num);
console.log(hasTwo);

```

## 用法

### 命令行的形式(在项目根目录执行语句):

```shell
./node_modules/.bin/babel src --out-dir lib
```

这段语句的意思是: 它使用我们设置的解析方式来解析src目录下的所有JS文件, 并将转换后的每个文件都输出到lib目录下.

另外, 如果你是`npm@5.2.0`附带的`npm`包运行器的话, 就可以用`npx babel`来代替`./node_modules/.bin/babel`:

```shell
npx babel src --out-dir lib
```

### 给package.json中配置一段脚本命令:

```json
{
    "name": "babel-basic",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "build": "babel src -d lib"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
       "@babel/cli": "^7.8.4",
       "@babel/core": "^7.8.4"
    }
}

```

现在运行`npm run build`效果也是一样的, `-d`是`--out-dir`的缩写...

(我们使用上面的 `--out-dir` 选项。你可以通过使用 `--help` 运行它来查看 `cli `工具接受的其余选项。但对我们来说最重要的是 `--plugins` 和 `--presets`。)

```shell
npx babel --help
```

## 插件plugins

### 基本概念

知道了Babel的基本用法之后, 让我们来看看具体的代码转换.

现在要介绍的是插件plugins, 它的本质就是一个JS程序, 指示着Babel如何对代码进行转换.

所以你也可以编写自己的插件来应用你想要的任何代码转换.

### 插件案例(箭头函数插件)
如果你是要将ES6+转成ES5, 可以依赖官方插件, 例如:

`@babel/plugin-transform-arrow-functions`:

```shell
cnpm i --save-dev @babel/plugin-transform-arrow-functions
npx babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
```

## Presets

### 基本概念

如果想要转换ES6+的其它代码为ES5, 我们可以使用"preset"来代替预先设定的**一组插件**, 而不是逐一添加我们想要的所有插件.

**这里可以理解为一个`preset`就是一组插件的集合.**

`presets`和`plugins`一样, 也可以创建自己的`preset`, 分享你需要的任何插件组合.

### @babel/preset-env

例如, 我们使用envpreset:

```shell
cnpm i --save-dev @babel/preset-env
```

env preset这个preset包括支持现代JavaScript(ES6+)的所有插件.

所以也就是说你安装使用了`env` `preset`之后, 就可以看到其它ES6+语法的转换了.

## 配置

上面👆介绍的都是一些终端传入CLI的方式, 在实际使用上, 我们更加偏向于配置文件.

例如我们在项目的根目录下创建一个babel.config.js文件:

```javascript
const presets = [
	[
    "@babel/env",
    {
      targets: {
        // edge: "17",
        edge: "10",
        chrome: "64",
        firefox: "60",
        safari: "11.1"
      }
    }
  ]	
]

module.exports = { presets };

```

加上这个配置的作用是:

* 使用了envpreset这个preset
* env preset只会为目标浏览器中没有的功能加载转换插件

现在你要使用这个配置就很简单了, 直接用我们前面package.json配置的命令行语句:

```json
{
	"scripts": {
		"build": "babel src -d lib"
	}
}

```

执行`npm run build`就可以了.

这个命令行语句看起来并没有修改, 那是因为它默认会去寻找跟根目录下的一个名为`babel.config.js`的文件(或者babelrc.js也可以, 这个在之后的使用babel的几种方式中会说到), 所以其实就相当于以下这个配置:

```json
{
	"scripts": {
		"build": "babel src -d lib --config-file ./babel.config.js"
	}
}
```

因此如果你的Babel配置文件是`babel.config.js`的话, 这两种效果是一样的.

(--config-file指令就类似于webpack中的--config, 用于指定以哪个配置文件构建)
这里我重点要说一下**只会为目标浏览器中没有的功能加载转换插件**这句话的意思.

例如我这里配置的其中一项是`edge: "17"`, 那就表示它转换之后的代码支持到`edge17`.

## Polyfill

Plugins是提供的插件, 例如箭头函数转普通函数`@babel/plugin-transform-arrow-functions`

Presets是一组Plugins的集合.

**而Polyfill是对执行环境或者其它功能的一个补充.**

就像现在你想在edge10浏览器中使用ES7中的方法includes(), 但是我们知道这个版本的浏览器环境是不支持你使用这个方法的, 所以如果你强行使用并不能达到预期的效果.

而polyfill的作用正是如此, 知道你的环境不允许, 那就帮你引用一个这个环境, 也就是说此时编译后的代码就会变成这样:

```javascript
// 原来的代码
var hasTwo = [1, 2, 3].includes(2);

// 加了polyfill之后的代码
require("core-js/modules/es7.array.includes");
require("core-js/modules/es6.string.includes");
var hasTwo = [1, 2, 3].includes(2);
```

### babel/polyfill

`babel/polyfill`用来模拟完成ES6+环境:

* 可以使用像Promise或者WeakMap这样的新内置函数
* 可以使用像Array.from或者Object.assign这样的静态方法
* 可以使用像Array.prototype.includes这样的实例方法
* 还有generator函数

为了实现这一点, `Polyfill`增加了**全局范围**以及像String这样的原生原型.

而`@babel/polyfill`模块包括了`core-js`和自定义`regenerator runtime`

对于库/工具来说, 如果你不需要像Array.prototype.includes这样的实例方法, 可以使用`transform runtime`插件, 而不是使用污染全局的@babel/polyfill.

对于**应用程序**, 我们建议安装使用`@babel/polyfill`

```shell
cnpm i --save @babel/polyfill
```

(注意 --save 选项而不是 --save-dev，因为这是一个需要在源代码之前运行的 polyfill。)

但是由于我们使用的是env preset, 这里个配置中有一个叫做 `"useBuiltIns"`的选项

如果将这个选择设置为"usage", 就只包括你需要的polyfill

此时的babel.config.js调整为:

```javascript
const presets = [
	[
		"@babel/env",
		{
			targets: {
				edge: "17",
				chrome: "64",
				firefox: "67",
				safari: '11.1'
			},
+			useBuiltIns: "usage"
		}
	]
]

module.exports = { presets }
```

安装配置了@babel/polyfill, Babel将检查你的所有代码, 然后查找目标环境中缺少的功能, 并引入仅包含所需的polyfill

(如果我们没有将 env preset 的 "useBuiltIns" 选项的设置为 "usage" ，就必须在其他代码之前 require *一次完整* 的 polyfill。)

## 小结

* babel/cli 允许我们从终端运行Babel
* envpreset 只包含我们使用的功能的转换,实现我们的目标浏览器中缺少的功能
* @babel/polyfill实现所有新的JS功能, 为目标浏览器引入缺少的环境