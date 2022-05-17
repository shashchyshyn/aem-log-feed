let autoScrollEnabled = true;

function setAutoScroll(autoScrollState) {
    if (autoScrollState) {
        autoScrollToggle.classList.remove('auto-scroll-non-active');
        autoScrollToggle.classList.add('auto-scroll-active');
        autoScrollEnabled = true;
    } else {
        autoScrollToggle.classList.remove('auto-scroll-active');
        autoScrollToggle.classList.add('auto-scroll-non-active');
        autoScrollEnabled = false;
    }
}

autoScrollToggle.addEventListener("click", () => {
    setAutoScroll(!autoScrollEnabled);
});

function updateScroll() {
    if (autoScrollEnabled) {
        list.scrollTop = list.scrollHeight;
    }
}


window.addEventListener('wheel', function(event) {
     if (event.deltaY < 0) {
        console.log('scrolling up');
        setAutoScroll(false);
     } else if (event.deltaY > 0) {
        console.log('scrolling down');
//        var element = event.target;
//        if (element.scrollHeight - element.scrollTop === element.clientHeight)
//        {
//            console.log('scrolled down');
//        }
     }
});