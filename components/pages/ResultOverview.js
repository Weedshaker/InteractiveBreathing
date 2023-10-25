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
    this.removeClickListener = event => {
     if (typeof event.composedPath === 'function' && event.composedPath()[0] && Array.from(event.composedPath()[0].classList).some(name => name.includes('time')) && self.confirm(`Do you want to delete the Entry: ${event.composedPath()[0].textContent}`)) {
       const tr = Array.from(event.composedPath()).find(el => el.tagName === 'TR')
       if (tr && tr.previousElementSibling && tr.previousElementSibling.querySelector('.date')) {
        new Promise(resolve => this.dispatchEvent(new CustomEvent('removeTime', {
          /** @type {import("../controllers/LocalStorage.js").RemoveTimeDetail} */
          detail: {
            time: event.composedPath()[0].textContent,
            date: tr.previousElementSibling.textContent.trim(),
            resolve
          },
          bubbles: true,
          cancelable: true,
          composed: true
        }))).then(
          /**
           * @param {import("../controllers/LocalStorage.js").TimeObject | null} times
           * @return {void}
           */
          times => {
            if (!times) return
            this.results.innerHTML = this.renderTable(times)
            this.undo.hidden = false
          }
        )
      }
     }
    }
    this.undoClickListener = event => {
      new Promise(resolve => this.dispatchEvent(new CustomEvent('undoTime', {
        /** @type {import("../controllers/LocalStorage.js").UndoTimeDetail} */
        detail: {
          resolve
        },
        bubbles: true,
        cancelable: true,
        composed: true
      }))).then(
        /**
        * @param {import("../controllers/LocalStorage.js").TimeObject | null} times
        * @return {void}
        */
        times => {
          if (!times) return
          this.results.innerHTML = this.renderTable(times)
          this.undo.hidden = true
        }
      )
    }
    this.endedListener = event => {
      // play the 5min sound twice to encourage 10min meditation after done breathing
      if (location.hash === '#/result') this.sound.play()
    }
  }

  connectedCallback (newRound = true) {
    if (document.fullscreenElement) document.exitFullscreen()
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    this.renderHTML().then(() => {
      this.end.addEventListener('click', this.clickListener)
      this.addEventListener('click', this.removeClickListener)
      this.undo.addEventListener('click', this.undoClickListener)
      this.sound.addEventListener('ended', this.endedListener, { once: true })
      this.sound.volume = 0.8
      this.startSound()
    })
    sessionStorage.removeItem('round')
    document.addEventListener('keydown', this.keydownListener)
    this.dispatchEvent(new CustomEvent('release-wake-lock', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {
    document.removeEventListener('keydown', this.keydownListener)
    this.end.removeEventListener('click', this.clickListener)
    this.removeEventListener('click', this.removeClickListener)
    this.undo.removeEventListener('click', this.undoClickListener)
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
      :host button {
        border-radius: 0.5em;
        border: solid 1px coral;
        background-color: transparent;
        color: coral;
        cursor: pointer;
      }
      :host button:hover {
        border-color: darkcyan;
        color: darkcyan;
      } 
      :host b {
        cursor: pointer;
      }
      :host .time2 {
        color: silver;
      }
      :host .time3 {
        color: gold;
      }
      :host .time4, :host .time5, :host .time6, :host .time7, :host .time8, :host .time9, :host .time10 {
        color: red;
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
        transition: color 0.3s ease-out;
        cursor: pointer;
        padding: 0 0 2.5em 3em;
        position: absolute;
        right: 0;
        top: 0;
      }
      :host > .title > .end:hover, :host > .title > .end:active, :host > .title > .end:focus {
        color: darkcyan;
      }
      :host > .title > * {
        font-weight: bold;
        text-transform: uppercase;
      }
      :host > .undo {
        position: fixed;
        bottom: 1em;
        left: 1em;
      }
      :host > .results {
        grid-area: results;
        overflow: auto;
      }
      :host > .results > table {
        margin: 0 auto;
      }
      :host > .results > table th {
        text-decoration: underline;
      }
      :host > .results > a, :host > div > a {
        color: var(--color);
        text-decoration: none;
      }
      :host a > span {
        display: inline-block;
        transition: transform .3s ease;
      }
      :host a:hover > span:first-of-type {
        transform: translate(0.4em, -0.1em) rotate(20deg);
      }
      :host a:hover > span:last-of-type {
        transform: translate(-0.4em, -0.1em) rotate(-20deg);
      }
      :host .app {
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
        this.html = /* html */`
          <div class=title>
            <iframe class=gh-button src="https://ghbtns.com/github-btn.html?user=Weedshaker&amp;repo=InteractiveBreathing&amp;type=star&amp;count=true&amp;size=large" scrolling="0" width="160px" height="30px" frameborder="0"></iframe>
            <div>Results</div>
            <div class=end>Start Over [ctrl]</div>
          </div>
          <button class=undo>Undo</button>
          <div class=results>${this.renderTable(times)}</div>
          <div><hr><a class=app href="https://play.google.com/store/apps/details?id=io.github.weedshaker.twa&rdid=io.github.weedshaker.twa" target="_blank"><span>👉</span>&nbsp;Please support my work by buying the app&nbsp;<span>👈</span></a> | <a href="https://github.com/Weedshaker/InteractiveBreathing" target="_blank">v. beta 1.0.17</a></div>
          <audio class=sound src="./sound/finishing.mp3"></audio>
        `
        this.undo.hidden = true
      }
    )
  }

  /**
   * renders the result table
   *
   * @param {import("../controllers/LocalStorage.js").TimeObject} times
   * @return {string}
   */
  renderTable (times) {
    let colspan = 0
    for (const key in times) {
      if (times[key].length > colspan) colspan = times[key].length
    }
    let table = ''
    // @ts-ignore
    Object.keys(times).sort((a, b) => (new Date(b) - new Date(a))).forEach(key => (table += /* html */`
      <tr>
        <th colspan=${colspan} class=date>${key}</th>
      </tr>
      <tr>
        ${times[key].map((time, i) => /* html */`<td>Round&nbsp;${i + 1}: <b class="time${Number(time.split(':')[0])}" title="click to delete this entry">${time}</b></td>`).join('')}
      </tr>
    `))
    return /* html */`
      <table>
        <tbody>
          ${table}
        </tbody>
      </table>
    `
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

  get results () {
    return this.root.querySelector('.results')
  }

  get undo () {
    return this.root.querySelector('.undo')
  }

  get sound () {
    return document.querySelector('#finishing') || this.root.querySelector('.sound')
  }
}
