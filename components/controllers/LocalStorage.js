// @ts-check

/* global HTMLElement */
/* global localStorage */

/**
 * @typedef {{ [key: number]: string[] } | {}} TimeObject
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
     * @return {void}
     */
    this.setTimeListener = event => {
      if (event && event.detail && event.detail.time) {
        let times = this.getTimesListener()
        const key = new Intl.DateTimeFormat(navigator.language).format(Date.now())
        key in times ? times[key].push(event.detail.time) : times = Object.assign(times, { [key]: [event.detail.time] })
        localStorage.setItem('times', JSON.stringify(times))
      }
    }

    /**
     * Listens to the event name/typeArg: 'getTimes'
     *
     * @param {CustomEvent & {detail: GetTimesDetail}} [event=null]
     * @return {TimeObject}
     */
    this.getTimesListener = (event = null) => {
      let times = {}
      try {
        times = JSON.parse(localStorage.getItem('times') || '{}')
      } catch (e) {
        console.error('Your localStorage times are brocken, please clear your localStorage with the command: "localStorage.removeItem(\'times\')"')
      }
      if (event && event.detail && typeof event.detail.resolve === 'function') event.detail.resolve(times)
      return times
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
