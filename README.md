# js-minimap

[中文文档](https://github.com/hx24/js-minimap/blob/master/README-CN.md)

Generate a minimap for your web page(or a module), and observe the view to update automatic.

自动生成页面（或局部模块）的缩略图，并可观察视图变化以自动更新缩略图。  

[Demo](https://www.huangxin.fun/static/js-minimap/)

![preview](https://qnm.hunliji.com/FtjaiZMwrepSyKiB33s9KhHrZk9J)

## Installation

### NPM

```javascript
import Minimap from 'js-minimap'
```

### Browser

```html
<script src="js-minimap/dist/minimap.umd.js" />

// cdn
<script src="https://cdn.jsdelivr.net/npm/js-minimap" />
// or
<script src="https://unpkg.com/js-minimap" />
```

## Usage

```html
<div class="container">
  <!-- your content -->
</div>
<div class="minimap"></div>
<script>
  const container = document.querySelector('.container') // any container you want to generate a minimap for
  const target = document.querySelector('.minimap') // the container of the minimap
  const minimap = new Minimap({
    container,
    target,
    width: 200,
    observe: true, // default true
    throttle: 30, // default 30
  })
</script>
```

## Options

| Option    | Description                                                                         | Type        | Default |
| :-------- | :---------------------------------------------------------------------------------- | :---------- | :------ |
| container | any container you want to generate a minimap for                                    | HTMLElement | -       |
| target    | somewhere you want to place the minimap.                                            | HTMLElement | -       |
| width     | minimap's width                                                                     | number      | 200     |
| height    | minimap's height, if `width` is available, `height` will be ignored                 | number      | -       |
| observe   | whether observe the view container to update the minimap, based on MutationObserver | boolean     | true    |
| throttle  | throttle time                                                                       | number      | 30      |

## Methods

### reset

if you want to reset the minimap manually, call `reset` method.

```javascript
const minimap = new Minimap({
  container,
  target,
  observe: false,
})

// when you want to reset the minimap, for example, the container's content changed
minimap.reset()
```
