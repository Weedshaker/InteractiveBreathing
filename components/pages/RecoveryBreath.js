// @ts-check
import RetentionTime from './RetentionTime.js'

/* global location */

/**
 * Recovery Time
 *
 * @export
 * @class RecoveryBreath
 * @type {CustomElementConstructor}
 */
export default class RecoveryBreath extends RetentionTime {
  constructor (...args) {
    super(...args)
    this.dblclickListener = event => this.nextPage()
    this.animationiterationListener = event => {}
    this.animationstartListener = event => setTimeout(() => {
      this.bubble.classList.remove('animate')
      this.breathSound.pause()
    }, this.animationDuration / 2)
  }

  connectedCallback () {
    super.connectedCallback()
    this.bubble.addEventListener('animationstart', this.animationstartListener)
    this.bubble.classList.add('animate')
    this.startSound(this.breathSound)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.bubble.removeEventListener('animationstart', this.animationstartListener)
    this.bubble.classList.remove('animate')
    this.breathSound.pause()
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
      <div class="instruction-two init">Tap twice to start next round [space]</div>
      <div class=instruction-two></div>
      <audio class=sound src="./sound/longGong.mp3"></audio>
      <audio class=breath-sound src="./sound/breath.mp3"></audio>
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

  get breathSound () {
    return this.root.querySelector('.breath-sound')
  }
}
