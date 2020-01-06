# art-html-loader

art-html-loader是一个[webpack loaders](https://www.webpackjs.com/configuration/module/#rule-loaders)，用于``art-templete``模板文件的编译，特别用于需要将其直接输出为html的项目。

## Install
```
$ npm install art-html-loader
```

## Usage
详细可请直接参考test

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
        use: [{ // 分别打包并生成html文件
            loader: 'file-loader',
            options: {
              name: '[name].html'
            }
          },
          'extract-loader', // 识别html中的路径，并保证他们合法
          { // 修改html中静态资源的路径为require，以便于'file-loader'进行路径重定向
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href']
            }
          },
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
