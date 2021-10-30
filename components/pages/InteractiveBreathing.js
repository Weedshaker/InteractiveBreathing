// @ts-check
import {Shadow} from '../../event-driven-web-components-prototypes/src/Shadow.js'

/* global self */

/**
 * As a molecule, this component shall hold Atoms
 *
 * @export
 * @class Bubble
 * @type {CustomElementConstructor}
 */
export default class Teaser extends Shadow() {
  constructor (...args) {
    super(...args)
  }

  connectedCallback () {
    super.connectedCallback()
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
  }

  disconnectedCallback () {

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
    return !this.root.querySelector('div.one')
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
        "round-counter end"
        "instruction-one instruction-one"
        "bubble bubble"
        "instruction-two instruction-two";
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(2, minmax(1em, auto)) 1fr minmax(1em, auto);
        height: 100vh;
        padding: 1em;
        width: 100vw;
      }
      :host > * {
        text-align: center;
      }
      :host > .round-counter {
        grid-area: round-counter;
        text-align: right;
      }
      :host > .end {
        color: red;
        grid-area: end;
      }
      :host > .instruction-one {
        grid-area: instruction-one;
        font-size: 2rem;
      }
      :host > .round-counter, :host > .instruction-one, :host > .end {
        text-transform: uppercase;
      }
      :host > .round-counter, :host > .instruction-one, :host > .end, :host > .instruction-two {
        font-weight: bold;
      }
      :host > .bubble {
        align-self: center;
        background-color: var(--theme-color);
        background: linear-gradient(0deg, rgba(13,59,104,0.8533788515406162) 0%, rgba(13,59,104,0.7525385154061625) 25%, rgba(255,255,255,1) 100%);
        border: 1em solid var(--theme-color);
        border-radius: 50%;
        box-shadow: 0 2px 8px 0 var(--theme-color);
        grid-area: bubble;
        height: min(50vw, 50vh);
        justify-self: center;
        width: min(50vw, 50vh);
      }
      :host > .instruction-two {
        grid-area: instruction-two;
      }
      @media only screen and (max-width: ${this.getAttribute('mobile-breakpoint') ? this.getAttribute('mobile-breakpoint') : self.Environment && !!self.Environment.mobileBreakpoint ? self.Environment.mobileBreakpoint : '1000px'}) {
        
      }
    `
  }

  /**
   * renders the html
   *
   * @return {void}
   */
  renderHTML () {
    this.html = /* html */`
      <div class=round-counter>Round 1</div><div class=end>Finish</div>
      <div class=instruction-one>Take 30 deep breaths</div>
      <div class=bubble></div>
      <div class=instruction-two>Tap twice to go into retention</div>
    `
  }
}
