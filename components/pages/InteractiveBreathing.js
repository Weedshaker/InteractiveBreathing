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
    this.html = 'here is going to be the bubble!'
  }
}
