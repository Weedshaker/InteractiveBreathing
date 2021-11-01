// @ts-check

/* global HTMLElement */
/* global CustomEvent */

/**
 * @typedef {{ number: string[] }} TimeObject
 */

/**
 * @typedef {{ time: string }} SetTimeDetail
 */

/**
 * @typedef {{ resolve: (TimeObject) => void }} GetTimesDetail
 */

/**
 * As a controller, this component becomes a store and organizes events
 * answers promise resolve on 'getTimes'
 *
 * @export
 * @class Comments
 */
export default class Comments extends HTMLElement {
  constructor () {
    super()

    /**
     * Listens to the event name/typeArg: 'setTime'
     *
     * @param {CustomEvent & {detail: SetTimeDetail}} event
     */
    this.setTimeListener = event => {
      console.log('changed', event, event.detail);
    }

    /**
     * Listens to the event name/typeArg: 'getTimes'
     *
     * @param {CustomEvent & {detail: GetTimesDetail}} event
     */
    this.getTimesListener = event => {
      
    }
  }

  connectedCallback () {
    this.addEventListener('setTime', this.setTimeListener)
    this.addEventListener('getTimes', this.getTimesListener)
  }

  disconnectedCallback () {
    this.removeEventListener('setTime', this.setTimeListener)
    this.removeEventListener('getTimes', this.getTimesListener)
  }
}
