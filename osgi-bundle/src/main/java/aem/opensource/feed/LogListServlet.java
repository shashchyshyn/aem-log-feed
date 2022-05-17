package aem.opensource.feed;

import org.apache.commons.io.input.ReversedLinesFileReader;
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
import java.io.File;
import java.io.IOException;
import java.rmi.ServerException;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=H",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.paths=/services/marketing/log/list",
})
public class LogListServlet extends SlingSafeMethodsServlet {

    private final Logger LOG = LoggerFactory.getLogger(getClass());

    @Reference
    private RegServ regServ;

    @Override
    protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServerException, IOException {

            resp.setCharacterEncoding("UTF-8");
            resp.setHeader("Content-Type", "text/html");

        for (String streamId : regServ.listStreams()) {
            resp.getWriter().println(streamId);
        }

        File file = new File("./crx-quickstart/logs/access.log");
        int n_lines = 10;
        int counter = 0;
        ReversedLinesFileReader object = new ReversedLinesFileReader(file);
        while(counter < n_lines) {
            //System.out.println(object.readLine());
            counter++;
        }


        if (regServ.listStreams().isEmpty()) {
            resp.getWriter().println("no streams");
        }

    }

}
