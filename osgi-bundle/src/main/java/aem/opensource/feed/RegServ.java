package aem.opensource.feed;

import ch.qos.logback.core.Appender;
import org.apache.commons.lang3.tuple.Pair;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;

import java.io.OutputStream;
import java.util.*;

@Component(immediate = true, service = RegServ.class)
public class RegServ {
    private Map<String, Pair<ServiceRegistration, LogObserver>> registrationMap = new HashMap<>();
    private BundleContext ctx;

    @Activate
    protected void activate(final BundleContext ctx, final Map<String, Object> properties) {
        this.ctx = ctx;
    }

    public LogObserver reg(String id, String[] loggers, OutputStream outputStream) {
        LogObserver appender = new LogObserver(outputStream);
        //final String[] loggers = new String[] {"com.expediagroup.marketing.global.core.translation"};//PropertiesUtil.toStringArray(properties.get("loggers"), new String[] {"ROOT"});
        Dictionary<String, Object> props = new Hashtable<>();
        props.put("loggers", loggers);
        ServiceRegistration appenderRegistration = ctx.registerService(Appender.class.getName(), appender, props);
        registrationMap.put(id, Pair.of(appenderRegistration, appender));
        return appender;
    }

    public void unReg(String id) {
        Pair<ServiceRegistration, LogObserver> pair = registrationMap.get(id);
        if (pair != null) {
            LogObserver appender = pair.getValue();
            ServiceRegistration appenderRegistration = pair.getKey();
            if (appender != null) {
                if (appender.isStarted()) {
                    appender.stop();
                }
                if (appenderRegistration != null) {
                    appenderRegistration.unregister();
                }
                registrationMap.remove(id);
            }
        }
    }

    public Set<String> listStreams() {
        //list current active streams
        return registrationMap.keySet();
    }

    public boolean keepAlive(String id) {
        if (!registrationMap.containsKey(id)) {
            return false;
        }
        Pair<ServiceRegistration, LogObserver> pair = registrationMap.get(id);
        if (pair != null) {
            LogObserver appender = pair.getValue();
            if (appender != null) {
                appender.keepAlive();
                return true;
            }
        }
        return false;
    }

    @Deactivate
    protected void deactivate() {
        //System.out.println("Deactivated");
    }

}
