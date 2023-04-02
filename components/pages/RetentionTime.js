// @ts-check
import BreathingBubble from './BreathingBubble.js'

/* global location */
/* global CustomEvent */

/**
 * Retention Time
 *
 * @export
 * @class RetentionTime
 * @type {CustomElementConstructor}
 */
export default class RetentionTime extends BreathingBubble {
  constructor (...args) {
    super(...args)
    this.dblclickListener = event => {
      this.dispatchEvent(new CustomEvent('setTime', {
        /** @type {import("../controllers/LocalStorage.js").SetTimeDetail} */
        detail: {
          time: this.bubble.textContent
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
      this.nextPage()
    }
    this.keydownListener = event => {
      if (event.keyCode === 17) return this.finishPage()
      if (event.keyCode === 32) return this.dblclickListener()
    }
    this.clickListenerOnce = event => {}
  }

  connectedCallback () {
    super.connectedCallback(false)
    this.roundCounter.textContent = `Round ${this.round}`
    this.stopWatch()
    this.startSound()
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    clearInterval(this.interval)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    // @ts-ignore
    return !this.bubble
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    super.renderCSS()
    this.css = /* css */ `
      :host {
        --font-size-100: min(min(20vw, 25vh), 15em);
      }
      :host > .bubble {
        font-weight: bold;
      }
    `
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.html = ''
    this.html = /* html */`
      <div class=title>
        <div class=round-counter>Round ${this.round}</div>
        <div class=end>Finish [ctrl]</div>
      </div>
      <div class=instruction-one>Let go and hold your breath <br><q>as long as possible or comfortable</q></div>
      <div class=bubble>0:00</div>
      <div class="instruction-two init">Tap twice to go into recovery breath [space]</div>
      <div class=instruction-two></div>
      <audio class=sound src="./sound/littleGong.mp3"></audio>
    `
  }

  nextPage () {
    location.hash = '/recovery'
  }

  stopWatch () {
    this.bubble.textContent = '0:00'
    const startTime = Date.now()
    const intervalNumber = 100
    this.interval = setInterval(() => {
      const pastTime = Date.now() - startTime
      if (pastTime && (pastTime % 60000) < intervalNumber) this.startSound()
      this.bubble.textContent = this.formatTime(pastTime)
    }, intervalNumber)
  }

  formatTime (timestamp) {
    const date = new Date(timestamp)
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${minutes}:${String(seconds).length < 2 ? `0${seconds}` : seconds}`
  }

  get sound () {
    return document.querySelector('#littleGong') || this.root.querySelector('.sound')
  }
}
