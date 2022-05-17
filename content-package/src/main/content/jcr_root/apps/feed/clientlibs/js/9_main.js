

filterInput.addEventListener("keyup", function(event) {
     if (filterInput.value) {
        filterIcon.classList.add('active');
        filterValue = filterInput.value;
     } else {
        filterIcon.classList.remove('active');
        filterValue = DEFAULT_FILTER_VALUE;
     }
});

let filterLevels = ['error', 'warn', 'info'];

let filterLevelToggles = document.querySelectorAll('.filter-level-toggle');
filterLevelToggles.forEach(toggle => {
    if (filterLevels.includes(toggle.dataset['level'])) {
        toggle.classList.add('active');
    }
    toggle.addEventListener("click", () => {
        let level = toggle.dataset['level'];
        var index = filterLevels.indexOf(level);
        if (index === -1) {
            filterLevels.push(level);
            toggle.classList.add('active');
        } else {
            filterLevels.splice(index, 1);
            toggle.classList.remove('active');
        }
        console.log(filterLevels);
    });
});

document.body.addEventListener("click", function(event) {
     let circle = event.target;
     if (circle.classList.contains('i-circle')) {
        let li = circle.closest('li');
        if (li.classList.contains('expanded')) {
            li.classList.remove('expanded');
        } else {
            li.classList.add('expanded');
        }
     }
});



function updateStatus(status) {
    indicator.classList.remove('connected');
    indicator.classList.remove('disconnected');
    indicator.classList.remove('fatal');
    if (status === 'connected') {
        indicator.classList.add('connected');
    }
    if (status === 'disconnected') {
        indicator.classList.add('disconnected');
    }
    if (status === 'fatal') {
        indicator.classList.add('fatal');
    }
}

let numberOfLines = 0;
function keepNumberOfLines() {
    if (numberOfLines > 150) {
        list.querySelector("ul > li").remove();
        numberOfLines--;
    }
}

function clearLog() {
    list.innerHTML = "";
}

clearLogButton.addEventListener("click", () => {
    clearLog();
});
document.body.addEventListener("keyup", function(event) {
     if (event.keyCode === 46) {
       event.preventDefault();
       clearLog();
     }
});

// Create a reference for the Wake Lock.
let wakeLock = null;

let isFeedActive = false;
function startFeed() {
    if (isFeedActive) {
        stopFeed();
        startFeed();
    } else {
        if (currentObserverId) { //id will be null or undefined when repeater is fully stopped
            setTimeout(startFeed, 50);
        } else {
            let loggersLine = loggers.value || 'ROOT';
            let newLoggers = loggersLine.replace(/\s/g,'').split(',');
            globalLoggers = newLoggers;
            isFeedActive = true;
            repeater(); //yes - starting async function as regular to start it in a separate loop and go next line
            startFeedButton.classList.add('active');
            stopFeedButton.classList.remove('active');

            //update url params
            if (history.pushState) {
               if (location.search) {
                   const newHref = location.href.replace(location.search, formatParams());
                   history.pushState({path: newHref}, '', newHref);
               } else {
                   const newHref = location.href + formatParams();
                   history.pushState({path: newHref}, '', newHref);
               }
            }

            // create an async function to request a wake lock
            try {
              navigator.wakeLock.request('screen').then((lock) => {
                wakeLock = lock;
                console.log('acquired wake lock ');
                console.log(wakeLock);
              });
              //statusElem.textContent = 'Wake Lock is active!';
            } catch (err) {
              // The Wake Lock request has failed - usually system related, such as battery.
              //statusElem.textContent = `${err.name}, ${err.message}`;
            }
        }
    }
}

function stopFeed() {
    if (isFeedActive) {
        isFeedActive = false;
        controller.abort();
        controller = new AbortController();
        //currentObserverId = null;
        startFeedButton.classList.remove('active');
        stopFeedButton.classList.add('active');

        if (wakeLock) {
        wakeLock.release()
          .then(() => {
            wakeLock = null;
            console.log('wake lock lost');
          });
          }
    }
}

function toggleFeed() {
    if (isFeedActive) {
        stopFeed();
    } else {
        startFeed();
    }
}

stopFeedButton.addEventListener("click", () => stopFeed());
startFeedButton.addEventListener("click", () => startFeed());
document.body.onkeyup = (e) => {
    if (e.keyCode == 32) {
        toggleFeed();
    }
}

function formatParams() {
    const params = new URLSearchParams(location.search);
    params.delete('l');
    for (let logger of globalLoggers) {
        params.append('l', logger);
    }
    return '?' + params.toString();
}

let loggersLineIsDirty = false;
loggers.addEventListener("keyup", function(event) {
     if (event.keyCode === 13) {
        if (loggersLineIsDirty) {
           loggersLineIsDirty = false;
           event.preventDefault();
           startFeed();
        }
     } else {
       loggersLineIsDirty = true;
       stopFeed();
     }
});



// Pad to 2 or 3 digits, default is 2
function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
}

const queryString = window.location.search;
//console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const urlLoggers = urlParams.getAll('l');
console.log(urlLoggers);

let globalLoggers = urlLoggers || ['ROOT'];

let controller = new AbortController();

let currentObserverId;
setInterval(() => {
    if (currentObserverId) {
        fetch("/services/log-touch?id=" + currentObserverId)
        .then((response) => {
            if (response.status == 200) {
                console.log('keptAlive')
            } else {
                if (response.status == 302) {
                   console.log('possible login page');
                }
                console.log('lost');
            }
        });
    }
}, 90000);

async function pull(loggers) {
    let paramLine = loggers.map(logger => "logger=" + logger).join("&");
    let { signal } = controller;
    return fetch(FEED_URL + '?' + paramLine, {signal})
    .then((response) => {
        if (response.status == 200) {
            updateStatus('connected');
        } else {
            if (response.status == 302) {
                console.log('possible login page');
            }
            updateStatus('disconnected');
        }
        return response.body.getReader();
    })
    .then((reader) => {
     return reader.read().then(function processText({ done, value }) {
       if (done) {
         return;
       }

       const chunk = new TextDecoder().decode(value);
       let arrayOfLines = chunk.match(/[^\r\n]+/g);
       for (let piece of arrayOfLines) {
            //TODO: before JSON parse, check for "<" in position 0, which might be html code
           try {
              let obj1 = JSON.parse(piece);
           } catch (e) {
              console.log(piece);
           }
           let obj = JSON.parse(piece);
           if (obj.level == 'init') {
                console.log("initiated " + obj.id);
                currentObserverId = obj.id;
           }
           if (filterLevels.includes(obj.level.toLowerCase()) && obj.formattedMessage.match(filterValue)) {
               list.appendChild(listItemTemplate(obj));
               numberOfLines++;
               keepNumberOfLines();
               updateScroll();
           }
       }

       return reader.read().then(processText);
     });
    })
    .then(() => console.log('finished overall'))
    .catch((e) => {
        updateStatus('disconnected');
        console.log(e);
    });
}

async function repeater() {
    console.log("started repeater");
    while (isFeedActive) {
        console.log('reconnect');
        await pull(globalLoggers);
    }
    console.log("finished repeater");
    currentObserverId = null;
    updateStatus('disconnected');
}

loggers.value = globalLoggers.join(',');
startFeed();