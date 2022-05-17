function listItemTemplate(obj) {
    let listItem = document.createElement('li');
    let itemLevel = document.createElement('span');
    itemLevel.classList.add("i-circle");
    itemLevel.classList.add(obj.level.toLowerCase());
    itemLevel.textContent = obj.level.charAt(0);
    listItem.appendChild(itemLevel);
    let itemMessage = document.createElement('span');
    itemMessage.classList.add("i-message");
    itemMessage.textContent = obj.formattedMessage;
    listItem.appendChild(itemMessage);

    let itemTime = document.createElement('span');
    itemTime.classList.add("time");

    var date = new Date(obj.timestamp);
    let time = date.toTimeString().split(' ')[0] + "." + pad(date.getMilliseconds(), 3);
    itemTime.textContent = time;
    listItem.appendChild(itemTime);

    let itemDetails = document.createElement('div');
    itemDetails.classList.add("message-details");
    let threadName = document.createElement('div');
    threadName.classList.add("threadName", "label");
    threadName.innerHTML = "<strong>Thread: </strong>" + obj.threadName;
    itemDetails.appendChild(threadName);

    let loggerName = document.createElement('div');
    loggerName.classList.add("loggerName", "label");
    loggerName.innerHTML = "<strong>Logger: </strong>" + obj.loggerName;
    itemDetails.appendChild(loggerName);

    let timeField = document.createElement('div');
    timeField.classList.add("time-field", "label");
    timeField.innerHTML = "<strong>  Time: </strong>" + time;
    itemDetails.appendChild(timeField);


    let level = document.createElement('div');
    level.classList.add("entry-level", "label");
    level.innerHTML = "<strong> Level: </strong>" + obj.level;
    itemDetails.appendChild(level);

    let msgField = document.createElement('div');
    msgField.classList.add("msg-field", "label");
    msgField.innerHTML = "<strong>Message: </strong>" + obj.formattedMessage;
    itemDetails.appendChild(msgField);


    if (obj.throwableStacktrace) {
       let exLabel = document.createElement('div');
       exLabel.classList.add("exception", "label");
       exLabel.innerHTML = "<strong>Exception:</strong>";
       itemDetails.appendChild(exLabel);

       let itemStacktrace = document.createElement('div');
       itemStacktrace.classList.add("stacktrace");
       itemStacktrace.textContent = obj.throwableStacktrace;
       itemDetails.appendChild(itemStacktrace);
    }

    listItem.appendChild(itemDetails);

    return listItem;
}
