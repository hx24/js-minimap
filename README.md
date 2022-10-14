# js-minimap

Generate a minimap for your web page(or a module).

## Installation

### NPM

```javascript
import Minimap from 'js-minimap'
```

### Bower

```html
<script src="js-minimap/src/index.js" />
```

## Usage

```html
<div class="container">
  <!-- your content -->
</div>
<div class="map-container"></div>
<script>
  const target = document.querySelector('.map-container') // the container of the minimap
  const container = document.querySelector('.container') // any container you want to generate a minimap for
  new Minimap({
    container,
    target,
  })
</script>
```

## Options
TODO

