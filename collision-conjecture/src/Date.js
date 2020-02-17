let currentdate = new Date();
let fullYear = currentdate.getFullYear()
let fullMonth = (currentdate.getMonth() + 1)
let fullDay = currentdate.getDate()
let hours = currentdate.getHours()
let minutes = currentdate.getMinutes()

let datetime = fullYear + "-" + "0" + fullMonth + "-" + fullDay + "_" + hours + ":" + minutes

let finaldate = fullYear + "-" + "0" + fullMonth + "-" + (fullDay + 1) + "_" + hours + ":" + minutes

export {datetime, finaldate}