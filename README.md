AEM Feed

aem.opensource.feed


available:
- read log stream from any class or logger
- auto scroll (toggleable) to the end of the steam
- connection status indicator
- expandable throwable stack-traces
- level markers (debug, error...)
- keep only last 200 items (to keep the web page performant)
- switch stream in the same page
- grep filtering
- level filtering
- stop/resume feed by space key
- when scroll up manually turn off auto-scroll
- keep loggers on page refresh

in dev:


pending:
- ui should send heartbeat to keep backend object alive, otherwise it should die

- refine color palette to have consistent colors across the page
- memory for latest used logger names (like 10 latest)


bugs:
- disconnects and become orange when user is logged out due to timeout
- java.lang.IllegalStateException: Service already unregistered.
- connection status indicator has triangle when hovered. it shouldn't

ideas:
- auto suggest while typing logger name
- play some ding sound for errors
- at first connection, pull previous logs as init data, and then connect to listener
- active interaction: in last line add any internal ops going on. like: reconnecting... and then just remove
    last line when reconnected. more like a terminal


NOTES:
Each logger name applies for any child category unless configured otherwise. 
E.g. a logger name of org.apache.sling applies to logger org.apache.sling.commons unless there is a different 
configuration for org.apache.sling.commons. (org.apache.sling.commons.log.names)

additivity - If set to false then logs from these loggers would not be sent to any appender attached higher in the hierarchy (org.apache.sling.commons.log.additiv)



https://sling.apache.org/documentation/development/logging.html
https://wttech.blog/blog/2020/making-sense-of-system-logs/