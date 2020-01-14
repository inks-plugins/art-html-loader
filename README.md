# art-html-loader

art-html-loader是一个[webpack loaders](https://www.webpackjs.com/configuration/module/#rule-loaders)，用于``art-templete``模板文件的编译，特别用于需要将其直接输出为html的项目。

## Install
```
$ npm install art-html-loader
```

## Demo
- ``test``文件中是一个简单的``demo``，其编译的文件可以查阅``test_dist``中的文件内容
- ``webpack.config.js``的配置可以参考``config/webpack.test.js`` 文件，为了方便测试使用的本地``loader``，请自行将其更改为``npm``线上``loader``包即可

## Usage
用法可请直接参考test

- webpack.config.js
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false
          },
        }]
      }, {
        test: /\.arthtml$/,
        exclude: /node_modules/,
        use: [
          // 分别打包并生成html文件
          {
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },

          // 识别html中的路径，并保证他们合法
          'extract-loader',

          // 修改html中静态资源的路径为require，以便于'file-loader'进行路径重定向
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href']
            }
          },

          // 编译.arthtml文件为.html文件
          'art-html-loader'
        ]
      }
    ]
  }
}

```

- .arthtml 文件
> 这是针对该``loaders``所有的文件扩展名，``art-html-loader``会使用``art-templete``将该文件编译成html文件
它的结构与vue类似，如下所示：
```
<template>
  <!--art 模板语法内容-->
</template>

<script>
  return {
    artHot: // 引入的art组件需要热更新的文件路径
    importData: // 引入用于art编译时提供的data数据,可以引入公用data
    data: {
      // 该页面定义的art编译时提供的data数据，会自动与importData引入的data进行合并
    },
    main: function (windows) {
      // 该页面的js逻辑，打包时会自动将其生成为自执行函数并传入windows，注入到body的script标签中
    }
  }
</script>
```

在vscode中开发的小伙伴，可以将语言模式配置成如下，便于开发时语言高亮显示：
```
"files.associations": {
  "*.art": "html",
  "*.arthtml": "html"
}
```

> 特别提醒：.arthtml文件主要用于需要将文件生成单独的html文件所用，其需要引用的组件部分，仍应为.art文件，详细可以参考test文件中的component内容。

> 这里要注意，在引用组件的时候，因为``art options``配置项会有一个``root``的配置，这里默认是``src``目录，因此在引用组件的时候``'./'``即代表``root``配置的目录，而静态资源如图片等是``file-loader``编译的，则需要根据其文件相对目录去引用。
如文件目录为：
- views
  - index.arthtml
- assets
  - test.jpg
- component
  - header.art
那在引用test.jpg与组件header.art时应为：
```
{{include './component/header.art' data}}
<img src="../assets/test.jpg" />
```

- 详解 .arthtml 文件 下的``<script>...</script>``

  - artHot? String | String[]
    - 由于引入的组件为art模板引擎的语法，因此引入组件并不会被热更新所获取，在开发时需要你想让引入的依赖组件实时热更新，那么就需要将其路径添加值该处，如果只有一个你可以直接写入路径字符串，如果是多个你可以将它们写成数组字符串。

  - importData? String | String[]
    - art模板引擎有一个数据对象，这里可以写入需要引用的数据对象的路径，如果只有一个你可以直接写入路径字符串，如果是多个你可以将它们写成数组字符串。它的可以用于共享数据的引入，比如你有很多页面都需要使用一个数据，就可以使用该项将文件引入到多个``.arthtml``文件中；或当数据太多，为了便于维护而直接引用一个文件。

  - data? Object
    - art模板引擎有一个数据对象，这里是该页面的数据对象，如果存在``importData``将与其合并，生成最终art文件的data，类似有私有数据，仅在该页面起作用。

  - main? Function
    - 该``.arthtml``页面的js逻辑，打包时会自动将其生成为自执行函数并传入windows，注入到body的script标签中。
