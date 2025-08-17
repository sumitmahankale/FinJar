package com.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.util.StringUtils;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Converts a Railway/Render style MYSQL_URL or PUBLIC URL (mysql://user:pass@host:port/db) into Spring Boot
 * datasource properties if an explicit JDBC URL wasn't supplied.
 */
public class MysqlUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String existing = environment.getProperty("spring.datasource.url");
        if (StringUtils.hasText(existing)) {
            System.out.println("[FinJar][early] Using existing spring.datasource.url=" + sanitize(existing));
            return; // already configured elsewhere
        }

        String raw = firstNonEmpty(
                environment.getProperty("FINJAR_DB_URL"),
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("MYSQL_URL"),
                environment.getProperty("MYSQL_PUBLIC_URL")
        );
        if (!StringUtils.hasText(raw)) return;
        if (raw.startsWith("jdbc:mysql://")) {
            System.out.println("[FinJar][early] Found JDBC URL (no transform): " + sanitize(raw));
            return; // nothing to do
        }
        if (!raw.startsWith("mysql://")) {
            System.out.println("[FinJar][early] Non-MySQL URL scheme detected, skipping transform: " + raw);
            return; // unrecognized scheme
        }
        try {
            URI uri = URI.create(raw);
            String userInfo = uri.getUserInfo();
            String username = null;
            String password = null;
            if (userInfo != null) {
                String[] parts = userInfo.split(":", 2);
                username = parts[0];
                if (parts.length > 1) password = parts[1];
            }
            String host = uri.getHost();
            int port = uri.getPort() == -1 ? 3306 : uri.getPort();
            String db = uri.getPath();
            if (db != null && db.startsWith("/")) db = db.substring(1);
            if (!StringUtils.hasText(db)) db = "finjar";
            String jdbc = "jdbc:mysql://" + host + ":" + port + "/" + db + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&socketTimeout=60000&connectTimeout=15000";
            System.out.println("[FinJar][early] Transformed mysql:// URL -> " + sanitize(jdbc));

            Map<String,Object> map = new HashMap<>();
            map.put("spring.datasource.url", jdbc);
            if (username != null && environment.getProperty("spring.datasource.username") == null) {
                map.put("spring.datasource.username", username);
            }
            if (password != null && environment.getProperty("spring.datasource.password") == null) {
                map.put("spring.datasource.password", password);
            }
            PropertySource<?> ps = new MapPropertySource("mysqlUrlDerived", map);
            environment.getPropertySources().addFirst(ps);
        } catch (Exception ex) {
            System.out.println("[FinJar][early] Failed to parse MYSQL_URL: " + ex.getMessage());
        }
    }

    private String firstNonEmpty(String... vals) {
        for (String v : vals) if (StringUtils.hasText(v)) return v; return null;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }

    private String sanitize(String url) {
        return url == null ? null : url.replaceAll("(?i)password=[^&]+", "password=***");
    }
}
