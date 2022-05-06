// @ts-check
import { Shadow } from '../../event-driven-web-components-prototypes/src/Shadow.js'

/* global CustomEvent */
/* global location */
/* global sessionStorage */

/**
 * old school table style Result Page
 *
 * @export
 * @class ResultOverview
 * @type {CustomElementConstructor}
 */
export default class ResultOverview extends Shadow() {
  constructor (...args) {
    super(...args)
    this.keydownListener = event => {
      if (event.keyCode === 17) return this.nextPage()
    }
    this.clickListener = event => this.nextPage()
    this.endedListener = event => {
      // play the 5min sound twice to encourage 10min meditation after done breathing
      if (location.hash === '#/result') this.sound.play()
    }
  }

  connectedCallback (newRound = true) {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    this.renderHTML().then(() => {
      this.end.addEventListener('click', this.clickListener)
      this.sound.addEventListener('ended', this.endedListener, { once: true })
      this.sound.volume = 0.5
      this.startSound()
    })
    sessionStorage.removeItem('round')
    document.addEventListener('keydown', this.keydownListener)
  }

  disconnectedCallback () {
    document.removeEventListener('keydown', this.keydownListener)
    this.end.removeEventListener('click', this.clickListener)
    this.sound.pause()
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector(`:host > style[_css], ${this.tagName} > style[_css]`)
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */ `
      :host {
        box-sizing: border-box;
        display: grid;
        grid-gap: 1em;
        grid-template-areas:
        "title"
        "results";
        grid-template-columns: 1fr;
        grid-template-rows: minmax(1em, auto) 1fr;
        height: 100vh;
        padding: 1em;
        width: 100vw;
      }
      :host > * {
        text-align: center;
      }
      :host > .title {
        grid-area: title;
        position: relative;
      }
      :host > .title > .gh-button {
        position: absolute;
        left: 0;
        top: 0;
      }
      :host > .title > .end {
        color: coral;
        cursor: pointer;
        padding: 0 0 3em 3em;
        position: absolute;
        right: 0;
        top: 0;
      }
      :host > .title > * {
        font-weight: bold;
        text-transform: uppercase;
      }
      :host > .results {
        grid-area: results;
      }
      :host > .results > table {
        margin: 0 auto;
      }
      :host > .results > table th {
        text-decoration: underline;
      }
    `
  }

  /**
   * renders the html
   *
   * @return {Promise<void>}
   */
  renderHTML () {
    this.html = ''
    return new Promise(resolve => this.dispatchEvent(new CustomEvent('getTimes', {
      /** @type {import("../controllers/LocalStorage.js").GetTimesDetail} */
      detail: { resolve },
      bubbles: true,
      cancelable: true,
      composed: true
    }))).then(
      /**
       * @param {import("../controllers/LocalStorage.js").TimeObject} times
       * @return {void}
       */
      times => {
        let colspan = 0
        for (const key in times) {
          if (times[key].length > colspan) colspan = times[key].length
        }
        let table = ''
        // @ts-ignore
        Object.keys(times).sort((a, b) => (new Date(b) - new Date(a))).forEach(key => (table += /* html */`
          <tr>
            <th colspan=${colspan}>${key}</th>
          </tr>
          <tr>
            ${times[key].map((time, i) => /* html */`<td>Round&nbsp;${i + 1}: <b>${time}</b></td>`).join('')}
          </tr>
        `))
        table = /* html */`
          <table>
            <tbody>
              ${table}
            </tbody>
          </table>
        `
        this.html = /* html */`
          <div class=title>
            <iframe class=gh-button src="https://ghbtns.com/github-btn.html?user=Weedshaker&amp;repo=InteractiveBreathing&amp;type=star&amp;count=true&amp;size=large" scrolling="0" width="160px" height="30px" frameborder="0"></iframe>
            <div>Results</div>
            <div class=end>Start Over [ctrl]</div>
          </div>
          <div class=results>${table}</div>
          <audio class=sound src="./sound/finishing.mp3"></audio>
        `
      }
    )
  }

  nextPage () {
    location.hash = '/breathing'
  }

  startSound (sound = this.sound) {
    sound.pause()
    sound.currentTime = 0
    sound.play()
  }

  get end () {
    return this.root.querySelector('.end')
  }

  get sound () {
    return document.querySelector('#finishing') || this.root.querySelector('.sound')
  }
}
