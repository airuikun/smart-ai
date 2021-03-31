import { mountRootParcel } from 'external-lib/index';

// const test = import('http://localhost:8080/app.js');

// console.log()
fetch('http://localhost:8080/app.js').then((res) => {
  console.log(98999, res)
})
// The parcel implementation
const parcelConfig = {
  bootstrap() {
    // one time initialization
    return Promise.resolve()
  },
  mount() {
    // use a framework to create dom nodes and mount the parcel
    return Promise.resolve()
  },
  unmount() {
    // use a framework to unmount dom nodes and perform other cleanup
    return Promise.resolve()
  }
}
// How to mount the parcel
const domElement = document.getElementById('place-in-dom-to-mount-parcel')
const parcelProps = {domElement, customProp1: 'foo'}
const parcel = mountRootParcel(parcelConfig, parcelProps)
console.log(1111,parcel)
// The parcel is being mounted. We can wait for it to finish with the mountPromise.
parcel.mountPromise.then(() => {
  console.log('finished mounting parcel!')
  // If we want to re-render the parcel, we can call the update lifecycle method, which returns a promise
  parcelProps.customProp1 = 'bar'
  return parcel.update(parcelProps)
})
.then(() => {
  // Call the unmount lifecycle when we need the parcel to unmount. This function also returns a promise
  return parcel.unmount()
})
