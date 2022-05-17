package aem.opensource.feed;

import com.google.gson.Gson;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.framework.InvalidSyntaxException;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.cm.Configuration;
import org.osgi.service.cm.ConfigurationAdmin;
import org.apache.sling.commons.osgi.PropertiesUtil;

import javax.servlet.Servlet;
import java.io.IOException;
import java.rmi.ServerException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=H",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.paths=/services/log-files-info",
})
public class LogFilesInfoServlet extends SlingSafeMethodsServlet {

    @Reference
    private ConfigurationAdmin configAdmin;

    @Override
    protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServerException, IOException {

        List<LogFileInfo> list = new ArrayList<>();

        try {
            Configuration[] configs = configAdmin.listConfigurations("(service.pid=org.apache.sling.commons.log.LogManager.factory.config*)");
            for (Configuration config: configs) {
                //System.out.println(config.getProperties());
                String fileName = PropertiesUtil.toString(config.getProperties().get("org.apache.sling.commons.log.file"), "defaultValue");
                String[] loggerNames = PropertiesUtil.toStringArray(config.getProperties().get("org.apache.sling.commons.log.names"));
                LogFileInfo info = new LogFileInfo();
                info.setFileName(fileName);
                info.setLoggers(Arrays.asList(loggerNames));
                list.add(info);
            }

            resp.getWriter().print(new Gson().toJson(list));

        } catch (InvalidSyntaxException e) {
            e.printStackTrace();
        }


    }

}
