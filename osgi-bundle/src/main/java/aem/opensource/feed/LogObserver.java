package aem.opensource.feed;

import ch.qos.logback.core.OutputStreamAppender;

import java.io.OutputStream;

public class LogObserver extends OutputStreamAppender {

    private OutputStream outputStream;
    private long lastAppendedTime = System.currentTimeMillis();
    private long lastKeepAliveTouch = System.currentTimeMillis();

    public LogObserver(OutputStream outputStream) {
        this.outputStream = outputStream;
    }

    public long getLastAppendedTime() {
        return lastAppendedTime;
    }

    public long getLastKeepAliveTouch() {return lastKeepAliveTouch; }

    public void keepAlive() {
        lastKeepAliveTouch = System.currentTimeMillis();
        //System.out.println("pinged");
    }

    @Override
    public String getName() {
        return "LogObserver";
    }

    @Override
    public void start() {
        this.setEncoder(new JsonEncoder());
        this.setOutputStream(outputStream);
        super.start();
    }

    @Override
    protected void append(Object eventObject) {
        lastAppendedTime = System.currentTimeMillis();
        super.append(eventObject);
    }

}
