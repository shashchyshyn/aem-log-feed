package aem.opensource.feed;

import ch.qos.logback.classic.spi.LoggingEvent;
import ch.qos.logback.classic.spi.ThrowableProxyUtil;
import ch.qos.logback.core.encoder.EchoEncoder;
import com.google.gson.Gson;

import java.time.Instant;
import java.util.*;

public class JsonEncoder extends EchoEncoder {

    private Gson gson = new Gson();

    @Override
    public byte[] encode(Object event) {
        if (event instanceof LoggingEvent) {
            LoggingEvent e = (LoggingEvent) event;
            Map<String, String> props = new HashMap<>();
            props.put("formattedMessage", e.getFormattedMessage());
            props.put("level", e.getLevel().toString());
            props.put("loggerName", e.getLoggerName());
            props.put("threadName", e.getThreadName());
            props.put("message", e.getMessage());

            props.put("timestamp", Instant.ofEpochMilli(e.getTimeStamp()).toString());

            if (e.getThrowableProxy() != null) {
                props.put("throwableMessage", e.getThrowableProxy().getMessage());
                props.put("throwableStacktrace", ThrowableProxyUtil.asString(e.getThrowableProxy()));
            }

            if (e.hasCallerData()) {
                Arrays.stream(e.getCallerData()).forEach(ste -> {
                    String className = ste.getClassName();
                    String methodName = ste.getMethodName();
                    int lineNumber = ste.getLineNumber();
//                    System.out.println();
//                    System.out.println(e.getFormattedMessage());
//                    System.out.println("StackTrace: " + className + ":" + methodName + "::" + lineNumber);
                });
            }

            return super.encode(gson.toJson(props));
        }
        return super.encode(event);
    }

}
