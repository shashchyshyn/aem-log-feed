let suggestions = document.querySelector('.suggested-loggers');

loggers.addEventListener("focus", () => {
    suggestions.style.display = 'block';
});

document.addEventListener("click", (e) => {
    let classes = e.target.classList;
    if (classes.contains("suggested-option")) {
        let loggersSet = e.target.dataset['loggers'];
        loggers.value = loggersSet;
        startFeed();
        suggestions.style.display = 'none';
    } else if (classes.contains("loggerName") || classes.contains("log-file-name")) {
        let loggersSet = e.target.parentElement.dataset['loggers'];
        loggers.value = loggersSet;
        startFeed();
        suggestions.style.display = 'none';
    } else if (classes.contains("loggers-input")) {

    } else {
        suggestions.style.display = 'none';
    }
});


let logFiles = [
];

function refreshOptions() {
    //recent, from local storage

    //log files
    let rootOption = document.createElement('div');
    rootOption.dataset['loggers'] = 'ROOT';
    rootOption.classList.add("suggested-option");
    rootOption.innerHTML = `<span class="loggerName">ROOT</span> <span class="log-file-name">(logs/error.log)</span>`;
    suggestions.appendChild(rootOption);
    for (let suggestedOption of logFiles) {
        let option = document.createElement('div');
        option.dataset['loggers'] = suggestedOption.loggers.join(',');
        option.classList.add("suggested-option");
        option.innerHTML = `<span class="loggerName">${suggestedOption.loggers.join(',')}</span> <span class="log-file-name">(${suggestedOption.fileName})</span>`;
        suggestions.appendChild(option);
    }
}

fetch("/services/log-files-info")
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                if (response.status == 302) {
                   console.log('possible login page');
                }
                console.log('lost');
            }
        })
        .then((data) => {
            logFiles = data;
            refreshOptions();
        });




