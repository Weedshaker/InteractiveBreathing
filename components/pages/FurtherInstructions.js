// @ts-check
import { Shadow } from '../../event-driven-web-components-prototypes/src/Shadow.js'

/* global CustomEvent */
/* global location */
/* global sessionStorage */

/**
 * old school table style Result Page
 *
 * @export
 * @class FurtherInstructions
 * @type {CustomElementConstructor}
 */
export default class FurtherInstructions extends Shadow() {
  constructor (...args) {
    super(...args)
    this.keydownListener = event => {
      if (event.keyCode === 17) return this.nextPage()
    }
    this.clickListener = event => this.nextPage()
    this.wimHofClickListener = event => event.stopPropagation()
  }

  connectedCallback (newRound = true) {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    this.addEventListener('click', this.clickListener)
    this.root.querySelector('.wim-hof').addEventListener('click', this.wimHofClickListener)
    document.addEventListener('keydown', this.keydownListener)
  }

  disconnectedCallback () {
    document.removeEventListener('keydown', this.keydownListener)
    this.removeEventListener('click', this.clickListener)
    this.root.querySelector('.wim-hof').removeEventListener('click', this.wimHofClickListener)
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
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    // @ts-ignore
    return !this.root.querySelector('.instruction-one')
  }

  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    this.css = /* css */ `
      :host {
        --border-width: min(10vw, 15rem);
        --font-size-0: min(min(33vw, 16vh), 10em);
        --font-size-100: min(min(65vw, 33vh), 20em);
        box-sizing: border-box;
        display: grid;
        grid-gap: 1em;
        grid-template-areas:
        "title"
        "instruction-one"
        "bubble"
        "instruction-two";
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, minmax(1em, auto)) 1fr minmax(1em, auto);
        height: 100vh;
        padding: 1em;
        width: 100vw;
      }
      :host b {
        font-size: 1.25em;
      }
      :host a {
        color: coral;
        transition: color 0.3s ease-out;
        text-decoration: none;
      }
      /*
      *, a {
        cursor: none;
      }
      */
      :host a:hover, :host a:active, :host a:focus {
        color: darkcyan;
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
      :host > * {
        text-align: center;
      }
      :host > .title {
        grid-area: title;
        position: relative;
      }
      :host > .title > .end {
        color: coral;
        transition: color 0.3s ease-out;
        cursor: pointer;
        padding: 0 0 3em 3em;
        position: absolute;
        right: 0;
        top: 0;
      }
      :host > .title > .end:hover, :host > .title > .end:active, :host > .title > .end:focus {
        color: darkcyan;
      }
      :host > .instruction-one {
        grid-area: instruction-one;
        font-size: 2rem;
      }
      :host > .instruction-one > q {
        font-size: 1.5rem;
      }
      :host > .instruction-one > a {
        font-size: 1.5rem;
        font-style: italic;
      }
      :host > .title > .gh-button {
        position: absolute;
        left: 0;
        top: 0;
      }
      :host > .title > .round-counter, :host > .instruction-one, :host > .title > .end, :host > .instruction-two {
        font-weight: bold;
      }
      :host ul {
        margin: auto;
        width: fit-content;
      }
      :host ul li {
        font-size: 1rem;
        list-style: decimal;
        text-align: left;
      }
      :host ul.add li {
        list-style: disc;
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
        <iframe class=gh-button src="https://ghbtns.com/github-btn.html?user=Weedshaker&amp;repo=InteractiveBreathing&amp;type=star&amp;count=true&amp;size=large" scrolling="0" width="160px" height="30px" frameborder="0"></iframe>
        <div>Further Instructions</div>
        <div class=end>Start Breathing [ctrl]</div>
      </div>
      <div class=instruction-one>
        <a class=wim-hof href=https://www.wimhofmethod.com/breathing-techniques target=_blank>
          <span>????</span> Instruction by Wim Hof <span>????</span>
        </a>
        <br>
        <br>
        <ul>
          <li><b>breathing:</b> Breath 30 times... relax, follow your breath.<br>(Breathing In: Your breath starts at your feet, lower belly or Muladhara [VAM] and flows up)<br>(Breathing Out: Your breath starts at your head, Ajna [OM] or Sahasrara and flows down)</li>
          <li><b>retention:</b> Let go and hold your breath as long as possible or comfortable. Focus on your heartbeat and feel the sensations.</li>
          <li><b>recovery:</b>Take a deep breath in and hold an other 15s.</li>
        </ul>
        <br>
        <ul class=add>
          <li>Repeat the three steps above at least three times.</li>
          <li>Meditate! See the colors, shapes and hear the sounds of the universe! Let go your feeling!</li>
          <li>Bring this level of awareness and relaxation into your daily life and contemplate during your daily activity by using your breath as an anchor!</li>
        </ul>
      </div>
    `
  }

  nextPage () {
    location.hash = '/breathing'
  }

  get end () {
    return this.root.querySelector('.end')
  }
}
