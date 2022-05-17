package aem.opensource.feed;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import java.io.IOException;
import java.rmi.ServerException;
import java.util.UUID;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=H",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.paths=/services/log-feed",
})
public class LogServlet extends SlingSafeMethodsServlet {

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    @Reference
    private RegServ regServ;

    @Override
    protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServerException, IOException {
        String id = "";
        try {
            resp.setCharacterEncoding("UTF-8");
            resp.setHeader("Content-Type", "text/html");
            resp.setHeader("Connection", "keep-alive");
            resp.setHeader("Transfer-Encoding", "chunked");

            id = UUID.randomUUID().toString();
            //TODO: cleanup this marketing reference
            String[] loggers = new String[] {"com.expediagroup.marketing.global.core.translation"};
            if (req.getParameterValues("logger") != null && req.getParameterValues("logger").length > 0) {
                loggers = req.getParameterValues("logger");
            }
            resp.getOutputStream().println("{\"level\":\"init\", \"id\":\"" + id + "\"}");
            resp.getOutputStream().flush();
            LogObserver appender = regServ.reg(id, loggers, resp.getOutputStream());

            do {
                Thread.sleep(10_000);
            } while (System.currentTimeMillis() - appender.getLastKeepAliveTouch() < 2 * 60_000);

            //System.out.println("Exited by timeout since last touch");
        } catch (Exception e) {
            LOG.error("sdf", e);
            //System.out.println("Exceptioned " + e.getMessage());
        } finally {
            regServ.unReg(id);
            //System.out.println("Unregistered");
        }
    }

}
