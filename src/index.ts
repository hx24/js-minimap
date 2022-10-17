import domToImage from 'dom-to-image'
import lodashThrottle from 'lodash.throttle'
import './style.css'

interface MinimapOptions {
  container: HTMLElement,
  target: HTMLElement,
  width?: number,
  height?: number,
  observe?: boolean,
  throttle?: number
}

class Minimap {
  private options: MinimapOptions
  private mapContainer: HTMLElement = null
  private mapSelector: HTMLElement = null
  private domPreview: HTMLImageElement = null
  private draging: boolean = false
  private mapWidth: number = 0
  private mapHeight: number = 0

  /**
   * minimap
   * @param {object} options 配置项
   * @param {object} options.container 要生成缩略图的容器
   * @param {object} options.target 放置缩略图的容器
   * @param {object} options.width 缩略图的宽度
   * @param {object} options.height 缩略图的高度，优先使用width，高度等比例生成
   * @param {object} options.observe 是否监听container内容变化，自动更新缩略图，默认开启
   * @param {object} options.throttle 缩略图节流时间
   */
  constructor(options: MinimapOptions) {
    this.options = options
    this.init()
  }

  private async init() {
    this.initMapStructure()
    this.setMapSize()
    await this.renderDomPreview()
    this.renderMapSelector()
    this.listenContainerScroll()
    this.setMapSelectorDrag()
    this.observeContainer()
  }

  /**
   * 重置minimap
   */
  async reset() {
    this.setMapSize()
    await this.renderDomPreview()
    this.renderMapSelector()
  }

  /**
   * 初始化minimap dom结构
   */
  private initMapStructure() {
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
  private setMapSize() {
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
  private renderDomPreview() {
    return new Promise<void>((resolve, reject) => {
      const { options, mapWidth, mapHeight, mapContainer } = this
      const { container } = options
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
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error)
          reject(error)
        })
    })
  }

  private getDomSize() {
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
  private renderMapSelector() {
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

  private setMapSelectorPosition() {
    const { mapSelector, mapWidth, mapHeight } = this
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
  private listenContainerScroll() {
    const { options } = this
    const { container } = options
    container.addEventListener('scroll', (e) => {
      if (!this.draging) {
        this.setMapSelectorPosition()
      }
    })
  }

  private setMapSelectorDrag() {
    const {
      mapSelector,
      options: { container },
    } = this

    let startMouseX = 0
    let startMouseY = 0
    let startSelectorX = 0
    let startSelectorY = 0

    const move = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const offsetX = clientX - startMouseX
      const offsetY = clientY - startMouseY

      const { mapWidth, mapHeight } = this

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

  /**
   * 监听container的变化, 重新渲染minimap
   */
  private observeContainer() {
    const { observe = true, throttle = 30 } = this.options
    const observer = new MutationObserver(
      lodashThrottle((mutationList: MutationRecord[]) => {
        if (!observe) return
        this.reset()
      }, throttle),
    )
    observer.observe(this.options.container, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    })
  }
}

export default Minimap
