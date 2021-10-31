// @ts-check
import BreathingBubble from './BreathingBubble.js'

/* global self */

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
    this.dblclickListener = event => this.nextPage()
    this.keydownListener = event => {
      if (event.keyCode === 17) return this.finishPage()
      if (event.keyCode === 32)  return this.dblclickListener()
    }
    this.clickListener = event => {}
  }

  connectedCallback () {
    // @ts-ignore
    this.round = Number(this.round) - 1 // correct the +1 from parent
    super.connectedCallback()
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
      <div class=instruction-one>Let go and hold</div>
      <div class=bubble>0:00</div>
      <div class="instruction-two init">Tap twice to go into recovery breath [space]</div>
      <div class=instruction-two></div>
    `
  }

  nextPage () {
    location.hash = '/recovery'
  }
}
