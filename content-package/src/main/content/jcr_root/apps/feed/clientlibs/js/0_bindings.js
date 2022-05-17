const FEED_URL = '/services/log-feed';
const DEFAULT_FILTER_VALUE = '.+';

let list = document.querySelector('.messages ul');
let indicator = document.querySelector('.connection-indicator');
let loggers = document.querySelector('input[name="loggers"]');
let autoScrollToggle = document.querySelector('.auto-scroll-toggle');
let clearLogButton = document.querySelector('.clear-log');
let stopFeedButton = document.querySelector('.stop-feed');
let startFeedButton = document.querySelector('.start-feed');
let filterIcon = document.querySelector('.filter-icon');
let filterInput = document.querySelector('input[name="filter"]');

let filterValue = DEFAULT_FILTER_VALUE;