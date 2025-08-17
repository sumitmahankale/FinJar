package com.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class DatasourceDiagnostic {
    private static final Logger log = LoggerFactory.getLogger(DatasourceDiagnostic.class);

    @Value("${spring.datasource.url:unknown}")
    private String jdbcUrl;

    @Value("${spring.datasource.username:unknown}")
    private String username;

    @EventListener(ApplicationReadyEvent.class)
    public void logDatasourceInfo() {
        String sanitized = jdbcUrl
                .replaceAll("(?i)password=[^&]+", "password=***")
                .replaceAll("(?i)(&|\\?)([^=]*secret|token)=[^&]+", "$1$2=***");
        log.info("[FinJar] Resolved JDBC URL: {}", sanitized);
        log.info("[FinJar] DB User: {}", username);
        if (jdbcUrl.contains("mysql.railway.internal")) {
            log.warn("[FinJar] Detected internal Railway host (mysql.railway.internal). If running on Render this will fail; use the PUBLIC host + port instead.");
        }
        if (!jdbcUrl.startsWith("jdbc:mysql://")) {
            log.warn("[FinJar] Datasource URL does not start with jdbc:mysql://. Ensure FINJAR_DB_URL or DATABASE_URL is a proper MySQL JDBC URL.");
        }
    }
}
