//flag for format of the clock
let isFormat24Hrs = true

//flag for type of the clock
let isClockAnalog = true

//to play sound of alarm
function playAlarm(audioFile) {
    var media = new Audio('./alarm.mp3');
    let promise = media.play()
    if (promise !== undefined) {
        promise.then(_ => {
            media.pause
        })
        .catch(error => {
            toastr["error"]("Error Occured! Sound can't be played")
        })
    }
}

/* To append a digit in front to make it always 2 digit number
    @param time : hour, minute, or second

    @return     : 2 digit number for hour, minute or second 
*/
function check(time) {
    if (time < 10) {
        return "0" + time
    }
    return "" + time
}

/* To set the time for digital clock
    @param hours    : hour part of time
    @param minutes  : minute part of time
    @param second   : second part of time
    @param period   : period part of time (Only for 12-Hour format)
*/
function setDigitalTime(hours, minutes, seconds, period) {
    document.getElementById('hourText').textContent = check(hours)
    document.getElementById('minuteText').textContent = check(minutes)
    document.getElementById('hourAlarm').placeholder = check(hours)
    document.getElementById('minuteAlarm').placeholder = check(minutes)
    if (seconds % 2 == 0) {
        document.getElementById('secondText').textContent = ""
    }
    else {
        document.getElementById('secondText').textContent = ":"
    }
    if (!isFormat24Hrs) {
        document.getElementById('digitalClock').style.width = '50%'
        document.getElementById('periodText').textContent = period
        document.getElementById('period').style.display = 'block'
    } else {
        document.getElementById('digitalClock').style.width = '40%'
        document.getElementById('period').style.display = 'none'
    }
}

// to change the flag of format and change the UI accordingly
function changeFormat() {
    if (isFormat24Hrs) {
        isFormat24Hrs = false
        document.querySelector('#periodDiv').style.display = 'block'
        document.getElementById('hourAlarm').max = 12
        document.getElementById('12-Hour').checked = true;
    }
    else {
        isFormat24Hrs = true
        document.querySelector('#periodDiv').style.display = 'none'
        document.getElementById('hourAlarm').max = 24
        document.getElementById('24-Hour').checked = true;
    }
}

// to change the clock type and change the UI accordingly
function changeClock() {
    if (isClockAnalog) {
        isClockAnalog = false
        $('#analogClock').fadeOut()
        $('#digitalClock').fadeIn()
        document.getElementById('digitalClock').style.display = 'flex'
        $('#changeFormat').fadeIn()
        document.getElementById('changeClock').style.left = '30%'
    }
    else {
        isClockAnalog = true
        $('#digitalClock').fadeOut()
        $('#changeFormat').fadeOut()
        $('#analogClock').fadeIn()
        document.getElementById('changeClock').style.left = '45%'
    }
}

/* to set the time and save it in local storage for alarm
    @param e : submit event to get the event data
*/
function setAlarm(e) {
    e.preventDefault()
    let hours = parseInt(document.getElementById('hourAlarm').value)
    let minutes = parseInt(document.getElementById('minuteAlarm').value)
    if (isNaN(hours) || isNaN(minutes)) {
        toastr["error"]("Hours and minutes can't be blank")
        return
    }
    let format = document.querySelector('input[name="format"]:checked').id
    if (format == "12-Hour") {
        let period = document.querySelector('input[name="period"]:checked').id
        if (period == "PM" && hours < 12) {
            hours += 12
        } else if ((period == "AM") && (hours == 12)) {
            hours = 0
        }
    }
    localStorage.setItem("hour", hours)
    localStorage.setItem("minute", minutes)
    toastr["success"]("Alarm has been set for " + check(hours) + " : " + check(minutes))
}

// sets the time for the clock
function setTime() {
    let date = new Date()
    let seconds = date.getSeconds()
    let minutes = date.getMinutes()
    let hours = date.getHours()
    if (localStorage.getItem('hour') == hours && localStorage.getItem('minute') == minutes && seconds == 0) {
        playAlarm()
        localStorage.clear()
    }
    let secondDegree = seconds * 6
    let minuteDegree = minutes * 6
    let hourDegree = hours * 30
    let period = "AM"
    document.getElementById('secondHand').style.transform = 'rotate(' + secondDegree + 'deg)'
    document.getElementById('minuteHand').style.transform = 'rotate(' + minuteDegree + 'deg)'
    document.getElementById('hourHand').style.transform = 'rotate(' + hourDegree + 'deg)'
    if (!isFormat24Hrs) {
        if (hours >= 12 && seconds >= 0 & minutes >= 0) {
            period = "PM"
        }
        hours = (hours % 12 == 0) ? 12 : (hours % 12)
    }
    setDigitalTime(hours, minutes, seconds, period)
    setTimeout(setTime, 500);
}

setTime()