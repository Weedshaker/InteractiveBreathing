// @ts-check
import FurtherInstructions from './FurtherInstructions.js'

/* global CustomEvent */
/* global location */
/* global sessionStorage */

/**
 * old school table style Result Page
 *
 * @export
 * @class FurtherInstructionsIframe
 * @type {CustomElementConstructor}
 */
export default class FurtherInstructionsIframe extends FurtherInstructions {
  /**
   * renders the css
   *
   * @return {void}
   */
  renderCSS () {
    super.renderCSS()
    this.css = /* css */ `
      :host {
        overflow-x: hidden;
      }
      :host iframe{
        min-height: 89vh;
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
        <br>
        <div>Kornfield, Jack : A path with heart : a guide through the perils and promises of spiritual life : Page 53 : DEVELOPING A HEALING ATTENTION describes this very well...</div>
        <div class=end>Start Breathing [ctrl]</div>
      </div>
      <div class=instruction-one>
        <iframe src="https://archive.org/details/pathwithheartgui0000korn/page/53/mode/1up" width="100%" height="100%" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>
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
