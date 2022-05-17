package aem.opensource.feed;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import java.io.IOException;
import java.rmi.ServerException;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=H",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.paths=/services/log-touch",
})
public class TouchServlet extends SlingSafeMethodsServlet {

    @Reference
    private RegServ regServ;

    @Override
    protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServerException, IOException {

        String id = req.getParameter("id");
        regServ.keepAlive(id);

    }

}
