
const timedUserMsg = (message, stateSetter, delay = 5000) => {
  stateSetter(message)
  setTimeout(() => {
    stateSetter("")
  }, delay)
}

export {timedUserMsg}