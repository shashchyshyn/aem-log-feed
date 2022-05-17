package aem.opensource.feed;

import java.util.ArrayList;
import java.util.List;

public class LogFileInfo {

    private String fileName;
    private List<String> loggers = new ArrayList<>();

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public List<String> getLoggers() {
        return loggers;
    }

    public void setLoggers(List<String> loggers) {
        this.loggers = loggers;
    }

    public void addLoggers(String logger) {
        this.loggers.add(logger);
    }

}
