# js-minimap

自动生成页面（或局部模块）的缩略图，并可观察视图变化以自动更新缩略图。

[Demo](https://www.huangxin.fun/static/js-minimap/)

![preview](https://qnm.hunliji.com/FtjaiZMwrepSyKiB33s9KhHrZk9J)

## 安装

### NPM

```javascript
import Minimap from 'js-minimap'
```

### 浏览器

```html
<script src="js-minimap/dist/minimap.umd.js" />

// cdn
<script src="https://cdn.jsdelivr.net/npm/js-minimap" />
// 或
<script src="https://unpkg.com/js-minimap" />
```

## 使用

```html
<div class="container">
  <!-- your content -->
</div>
<div class="minimap"></div>
<script>
  const container = document.querySelector('.container') // 要生成缩略图的容器
  const target = document.querySelector('.minimap') // 要放置缩略图的容器
  const minimap = new Minimap({
    container,
    target,
    width: 200, // 缩略图的宽度，会根据container的宽高比自动计算高度
    observe: true, // 默认 true
    throttle: 30, // 默认 30
  })
</script>
```

## Options

| 选项      | 描述                                                             | 类型        | 默认值 |
| :-------- | :--------------------------------------------------------------- | :---------- | :----- |
| container | 要生成缩略图的容器                                               | HTMLElement | -      |
| target    | 要放置缩略图的容器                                               | HTMLElement | -      |
| width     | 缩略图宽度                                                       | number      | 200    |
| height    | 缩略图高度, 如果设置了宽度，高度会被忽略                         | number      | -      |
| observe   | 是否监听 container 变化，以自动更新缩略图, 基于 MutationObserver | boolean     | true   |
| throttle  | 节流时间                                                         | number      | 30     |

## 方法

### reset

如果你想手动重置缩略图，可以调用 `reset` 方法。

```javascript
const minimap = new Minimap({
  container,
  target,
  observe: false,
})

// 当你想要重置缩略图时，比如容器的内容发生了变化
minimap.reset()
```
