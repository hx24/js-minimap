import domToImage from 'dom-to-image'
import './style.css'

class Minimap {
  constructor(options) {
    this.options = options
    this.mapWidth = 0
    this.mapHeight = 0
    this.mapContainer = null
    this.mapSelector = null
    this.domPreview = null
    this.draging = false
    this.init()
  }

  async init() {
    this.initMapStructure()
    this.setMapSize()
    await this.renderDomPreview()
    this.renderMapSelector()
    this.listenContainerScroll()
    this.setMapSelectorDrag()
  }

  /**
   * 初始化minimap dom结构
   */
  initMapStructure() {
    const { options } = this
    const { target } = options
    const mapContainer = document.createElement('div')
    const mapSelector = document.createElement('div')
    mapContainer.className = 'minimap-container'
    mapSelector.className = 'minimap-selector'

    target.appendChild(mapContainer)
    mapContainer.appendChild(mapSelector)
    this.mapContainer = mapContainer
    this.mapSelector = mapSelector
  }

  /**
   * 设置minimap的宽高
   */
  setMapSize() {
    let { container, width, height } = this.options
    if (!width && !height) {
      width = 200
    }
    const containerScrollWidth = container.scrollWidth
    const containerScrollHeight = container.scrollHeight
    if (width) {
      this.mapWidth = width
      this.mapHeight = (containerScrollHeight / containerScrollWidth) * width
    } else if (height) {
      this.mapHeight = height
      this.mapWidth = (containerScrollWidth / containerScrollHeight) * height
    }
  }

  /**
   * 渲染minimap的缩略图
   * @returns {Promise}
   */
  renderDomPreview() {
    return new Promise((resolve, reject) => {
      const { options, mapWidth, mapHeight, mapContainer } = this
      const { container, target } = options
      domToImage
        .toPng(container, {
          width: container.scrollWidth,
          height: container.scrollHeight,
        })
        .then((dataUrl) => {
          var img = new Image()
          img.src = dataUrl
          img.style.width = mapWidth + 'px'
          img.style.height = mapHeight + 'px'
          if (this.domPreview) {
            mapContainer.removeChild(this.domPreview)
          }
          this.domPreview = img
          mapContainer.appendChild(img)
          resolve()
          console.log('渲染完毕')
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
          reject(error)
        })
    })
  }

  getDomSize() {
    const { options } = this
    const { container } = options
    const {
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
    } = container

    return {
      containerWidth: clientWidth,
      containerHeight: clientHeight,
      containerScrollWidth: scrollWidth,
      containerScrollHeight: scrollHeight,
      containerScrollLeft: scrollLeft,
      containerScrollTop: scrollTop,
    }
  }

  /**
   * 渲染minimap的选择器
   */
  renderMapSelector() {
    const { mapSelector, mapWidth, mapHeight } = this
    const {
      containerWidth,
      containerHeight,
      containerScrollWidth,
      containerScrollHeight,
    } = this.getDomSize()
    const mapSelectorWidth = (containerWidth / containerScrollWidth) * mapWidth
    const mapSelectorHeight =
      (containerHeight / containerScrollHeight) * mapHeight
    mapSelector.style.width = mapSelectorWidth + 'px'
    mapSelector.style.height = mapSelectorHeight + 'px'
    this.setMapSelectorPosition()
  }

  setMapSelectorPosition() {
    const { options, mapSelector, mapWidth, mapHeight } = this
    const {
      containerScrollWidth,
      containerScrollHeight,
      containerScrollLeft,
      containerScrollTop,
    } = this.getDomSize()

    const left = containerScrollLeft * (mapWidth / containerScrollWidth)
    const top = containerScrollTop * (mapHeight / containerScrollHeight)
    mapSelector.style.left = left + 'px'
    mapSelector.style.top = top + 'px'
  }

  /**
   * 监听容器的滚动事件, 修改minimap的选择器位置
   */
  listenContainerScroll() {
    const { options } = this
    const { container } = options
    container.addEventListener('scroll', (e) => {
      if (!this.draging) {
        this.setMapSelectorPosition()
      }
    })
  }

  setMapSelectorDrag() {
    const {
      mapSelector,
      options: { container },
      mapWidth,
      mapHeight,
    } = this

    let startMouseX = 0
    let startMouseY = 0
    let startSelectorX = 0
    let startSelectorY = 0

    const move = (e) => {
      const { clientX, clientY } = e
      const offsetX = clientX - startMouseX
      const offsetY = clientY - startMouseY

      let left = startSelectorX + offsetX
      let top = startSelectorY + offsetY

      if (left < 0) {
        left = 0
      }

      if (left > mapWidth - mapSelector.clientWidth) {
        left = mapWidth - mapSelector.clientWidth
      }

      if (top < 0) {
        top = 0
      }

      if (top > mapHeight - mapSelector.clientHeight) {
        top = mapHeight - mapSelector.clientHeight
      }

      mapSelector.style.left = left + 'px'
      mapSelector.style.top = top + 'px'

      const { containerScrollWidth, containerScrollHeight } = this.getDomSize()
      const scrollLeft = left * (containerScrollWidth / mapWidth)
      const scrollTop = top * (containerScrollHeight / mapHeight)
      container.scrollTo(scrollLeft, scrollTop)
    }
    mapSelector.addEventListener('mousedown', (e) => {
      const { clientX, clientY } = e

      startMouseX = clientX
      startMouseY = clientY

      startSelectorX = +mapSelector.offsetLeft
      startSelectorY = +mapSelector.offsetTop

      mapSelector.addEventListener('mousemove', move)
      this.draging = true
    })

    document.addEventListener('mouseup', (e) => {
      mapSelector.removeEventListener('mousemove', move)
      this.draging = false
    })
  }
}

export default Minimap
