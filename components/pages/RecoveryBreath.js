// @ts-check
import RetentionTime from './RetentionTime.js'

/* global location */
/* global CustomEvent */

/**
 * Retention Time
 *
 * @export
 * @class RecoveryBreath
 * @type {CustomElementConstructor}
 */
export default class RecoveryBreath extends RetentionTime {
  constructor (...args) {
    super(...args)
    this.dblclickListener = event => this.nextPage()
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
      <div class=instruction-one>Take a deep breath in and hold</div>
      <div class=bubble>0:15</div>
      <div class="instruction-two init">Tap twice to start over [space]</div>
      <div class=instruction-two></div>
    `
  }

  nextPage () {
    location.hash = '/breathing'
  }

  stopWatch () {
    this.bubble.textContent = '0:15'
    const futureTime = (new Date()).setSeconds((new Date()).getSeconds() + 16)
    this.interval = setInterval(() => {
      const remainingTime = futureTime - Date.now()
      if (remainingTime <= 0) this.nextPage()
      this.bubble.textContent = this.formatTime(remainingTime)
    }, 100)
  }
}
