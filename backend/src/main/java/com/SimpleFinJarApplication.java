package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Base64; // legacy leftover (will remove when mock removed)
import java.nio.charset.StandardCharsets; // legacy leftover
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://finjar-chi.vercel.app", "https://finjar-frontend.vercel.app", "https://finjar.vercel.app"})
public class SimpleFinJarApplication {

    // ================= In-memory stores (NOT persistent) =================
    private static final Map<Long, Map<String, Object>> JARS = new ConcurrentHashMap<>();
    private static final Map<Long, Map<String, Object>> DEPOSITS = new ConcurrentHashMap<>();
    private static final AtomicLong JAR_ID_SEQ = new AtomicLong(0);
    private static final AtomicLong DEPOSIT_ID_SEQ = new AtomicLong(0);

    static {
        // Seed some example jars
        seedJar("Emergency Fund", 1000.0, 500.0, "Basic safety net");
        seedJar("Vacation", 2500.0, 850.0, "Trip to mountains");
        seedJar("New Laptop", 1800.0, 300.0, "Upgrade gear");

        // Seed deposits for jar 1
        seedDeposit(1L, 300.0, "Initial seed");
        seedDeposit(1L, 200.0, "Monthly save");
    }

    private static void seedJar(String name, Double target, Double current, String description) {
        long id = JAR_ID_SEQ.incrementAndGet();
        Map<String, Object> jar = new HashMap<>();
        jar.put("id", id);
        jar.put("name", name);
        jar.put("targetAmount", target);
        jar.put("currentAmount", current);
        jar.put("description", description);
        jar.put("createdAt", System.currentTimeMillis());
        jar.put("progress", computeProgress(current, target));
        JARS.put(id, jar);
    }

    private static void seedDeposit(Long jarId, Double amount, String description) {
        long id = DEPOSIT_ID_SEQ.incrementAndGet();
        Map<String, Object> deposit = new HashMap<>();
        deposit.put("id", id);
        deposit.put("jarId", jarId);
        deposit.put("amount", amount);
        deposit.put("description", description);
        deposit.put("createdAt", System.currentTimeMillis());
        DEPOSITS.put(id, deposit);
    }

    public static void main(String[] args) {
        SpringApplication.run(SimpleFinJarApplication.class, args);
    }

    private static final String APP_VERSION = "0.1.0-dev"; // adjust when deploying

    @GetMapping("/api/version")
    public ResponseEntity<Map<String,Object>> version() {
        Map<String,Object> m = new HashMap<>();
        m.put("version", APP_VERSION);
        m.put("timestamp", System.currentTimeMillis());
        m.put("description", "FinJar minimal API");
        return ResponseEntity.ok(m);
    }

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("FINJAR V4 FORCE DEPLOY - " + System.currentTimeMillis());
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("UP");
    }
    
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> apiHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "FinJar API v3 is fully operational");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) Map<String, Object> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
    String email = loginRequest != null && loginRequest.getOrDefault("email", null) instanceof String ?
        (String) loginRequest.get("email") : "john@example.com";
    String name = loginRequest != null && loginRequest.getOrDefault("name", null) instanceof String ?
        (String) loginRequest.get("name") : "John Doe";
    String token = generateJwt(email, name);
    response.put("token", token);

    Map<String, Object> user = new HashMap<>();
    user.put("id", 1);
    user.put("email", email);
    user.put("name", name);
    response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // Alias endpoint without /api prefix (fallback for older frontend bundles)
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> loginAlias(@RequestBody(required = false) Map<String, Object> loginRequest) {
        return login(loginRequest);
    }
    
    @PostMapping("/api/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody(required = false) Map<String, Object> registerRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful");
    String email = registerRequest != null && registerRequest.getOrDefault("email", null) instanceof String ?
        (String) registerRequest.get("email") : "newuser@example.com";
    String name = registerRequest != null && registerRequest.getOrDefault("name", null) instanceof String ?
        (String) registerRequest.get("name") : "New User";
    String token = generateJwt(email, name);
    response.put("token", token);

    Map<String, Object> user = new HashMap<>();
    user.put("id", 2);
    user.put("email", email);
    user.put("name", name);
    response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // Alias endpoint without /api prefix (fallback)
    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> registerAlias(@RequestBody(required = false) Map<String, Object> registerRequest) {
        return register(registerRequest);
    }

    // Additional user-oriented alias paths (frontend used /api/users/register mistakenly)
    @PostMapping("/api/users/register")
    public ResponseEntity<Map<String, Object>> registerUsersAlias(@RequestBody(required = false) Map<String, Object> registerRequest) {
        return register(registerRequest);
    }

    @PostMapping("/api/users/login")
    public ResponseEntity<Map<String, Object>> loginUsersAlias(@RequestBody(required = false) Map<String, Object> loginRequest) {
        return login(loginRequest);
    }

    // Real JWT util (lazy init). Replace secret via FINJAR_JWT_SECRET env var in production.
    private com.util.JwtUtil jwtUtil;
    private com.util.JwtUtil jwt() {
        if (jwtUtil == null) {
            String secret = System.getenv().getOrDefault("FINJAR_JWT_SECRET", "ChangeMe_AtLeast32Chars_Long_Secret_Key_123");
            jwtUtil = com.util.JwtUtil.withDefaults(secret);
        }
        return jwtUtil;
    }
    private String generateJwt(String email, String name) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("name", name);
        claims.put("role", "USER");
        return jwt().generateToken(email, claims);
    }
    private boolean validToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7);
        return jwt().isValid(token);
    }

    private ResponseEntity<Map<String, Object>> unauthorized() {
        Map<String, Object> m = new HashMap<>();
        m.put("success", false);
        m.put("message", "Unauthorized");
        return ResponseEntity.status(401).body(m);
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (!validToken(auth)) return unauthorized();
        Map<String, Object> m = new HashMap<>();
        m.put("success", true);
        m.put("message", "Logged out");
        return ResponseEntity.ok(m);
    }

    @GetMapping("/api/user/profile")
    public ResponseEntity<Map<String, Object>> userProfile(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (!validToken(auth)) return unauthorized();
        Map<String, Object> u = new HashMap<>();
        u.put("id", 1);
        u.put("email", "john@example.com");
        u.put("name", "John Doe");
        return ResponseEntity.ok(success("Profile fetched", "user", u));
    }

    @PutMapping("/api/user/update")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @RequestBody(required = false) Map<String, Object> body) {
        if (!validToken(auth)) return unauthorized();
        if (body == null) body = new HashMap<>();
        Map<String, Object> u = new HashMap<>();
        u.put("id", 1);
        u.put("email", body.getOrDefault("email", "john@example.com"));
        u.put("name", body.getOrDefault("name", "John Doe"));
        return ResponseEntity.ok(success("Profile updated", "user", u));
    }
    
    @GetMapping("/api/jars")
    public ResponseEntity<Map<String, Object>> getJars(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (!validToken(auth)) return unauthorized();
        List<Map<String, Object>> list = new ArrayList<>(JARS.values());
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", list.size());
        response.put("jars", list);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/jars")
    public ResponseEntity<Map<String, Object>> createJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @RequestBody(required = false) Map<String, Object> body) {
        if (!validToken(auth)) return unauthorized();
        if (body == null || !body.containsKey("name") || !body.containsKey("targetAmount")) {
            return ResponseEntity.badRequest().body(error("Missing required fields: name, targetAmount"));
        }
        String name = String.valueOf(body.get("name"));
        Double target = toDouble(body.get("targetAmount"), 0.0);
        String description = String.valueOf(body.getOrDefault("description", ""));
        long id = JAR_ID_SEQ.incrementAndGet();
        Map<String, Object> jar = new HashMap<>();
        jar.put("id", id);
        jar.put("name", name);
        jar.put("targetAmount", target);
        jar.put("currentAmount", 0.0);
        jar.put("description", description);
        jar.put("createdAt", System.currentTimeMillis());
        jar.put("progress", 0.0);
        JARS.put(id, jar);
        return ResponseEntity.ok(success("Jar created", "jar", jar));
    }

    @PutMapping("/api/jars/{id}")
    public ResponseEntity<Map<String, Object>> updateJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @PathVariable Long id,
                                                         @RequestBody(required = false) Map<String, Object> body) {
        if (!validToken(auth)) return unauthorized();
        Map<String, Object> jar = JARS.get(id);
        if (jar == null) return ResponseEntity.status(404).body(error("Jar not found"));
        if (body != null) {
            if (body.containsKey("name")) jar.put("name", body.get("name"));
            if (body.containsKey("description")) jar.put("description", body.get("description"));
            if (body.containsKey("targetAmount")) {
                Double target = toDouble(body.get("targetAmount"), toDouble(jar.get("targetAmount"), 0.0));
                jar.put("targetAmount", target);
                double current = toDouble(jar.get("currentAmount"), 0.0);
                jar.put("progress", computeProgress(current, target));
            }
        }
        return ResponseEntity.ok(success("Jar updated", "jar", jar));
    }

    @DeleteMapping("/api/jars/{id}")
    public ResponseEntity<Map<String, Object>> deleteJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @PathVariable Long id) {
        if (!validToken(auth)) return unauthorized();
        Map<String, Object> removed = JARS.remove(id);
        if (removed == null) return ResponseEntity.status(404).body(error("Jar not found"));
        // Remove related deposits
        DEPOSITS.values().removeIf(d -> id.equals(d.get("jarId")));
        return ResponseEntity.ok(success("Jar deleted", "jar", removed));
    }

    @PostMapping("/api/deposits")
    public ResponseEntity<Map<String, Object>> createDeposit(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @RequestBody(required = false) Map<String, Object> body) {
        if (!validToken(auth)) return unauthorized();
        if (body == null || !body.containsKey("jarId") || !body.containsKey("amount")) {
            return ResponseEntity.badRequest().body(error("Missing required fields: jarId, amount"));
        }
        Long jarId = toLong(body.get("jarId"));
        if (!JARS.containsKey(jarId)) {
            return ResponseEntity.badRequest().body(error("Jar not found"));
        }
        Double amount = toDouble(body.get("amount"), 0.0);
        String description = String.valueOf(body.getOrDefault("description", ""));
        long id = DEPOSIT_ID_SEQ.incrementAndGet();
        Map<String, Object> deposit = new HashMap<>();
        deposit.put("id", id);
        deposit.put("jarId", jarId);
        deposit.put("amount", amount);
        deposit.put("description", description);
        deposit.put("createdAt", System.currentTimeMillis());
        DEPOSITS.put(id, deposit);
        // Update jar current amount & progress
        adjustJarAmount(jarId, amount);
        return ResponseEntity.ok(success("Deposit added", "deposit", deposit));
    }

    @GetMapping("/api/deposits")
    public ResponseEntity<Map<String, Object>> listDeposits(@RequestHeader(value = "Authorization", required = false) String auth,
                                                            @org.springframework.web.bind.annotation.RequestParam(name = "jarId", required = false) Long jarId) {
        if (!validToken(auth)) return unauthorized();
        List<Map<String, Object>> list = new ArrayList<>(DEPOSITS.values());
        if (jarId != null) {
            list = list.stream().filter(d -> jarId.equals(d.get("jarId"))).collect(Collectors.toList());
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", list.size());
        response.put("deposits", list);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/deposits/{id}")
    public ResponseEntity<Map<String, Object>> updateDeposit(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @PathVariable Long id,
                                                             @RequestBody(required = false) Map<String, Object> body) {
        if (!validToken(auth)) return unauthorized();
        Map<String, Object> dep = DEPOSITS.get(id);
        if (dep == null) return ResponseEntity.status(404).body(error("Deposit not found"));
        double oldAmount = toDouble(dep.get("amount"), 0.0);
        if (body != null) {
            if (body.containsKey("amount")) {
                double newAmt = toDouble(body.get("amount"), oldAmount);
                dep.put("amount", newAmt);
                double delta = newAmt - oldAmount;
                adjustJarAmount(toLong(dep.get("jarId")), delta);
            }
            if (body.containsKey("description")) dep.put("description", body.get("description"));
        }
        return ResponseEntity.ok(success("Deposit updated", "deposit", dep));
    }

    @DeleteMapping("/api/deposits/{id}")
    public ResponseEntity<Map<String, Object>> deleteDeposit(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @PathVariable Long id) {
        if (!validToken(auth)) return unauthorized();
        Map<String, Object> dep = DEPOSITS.remove(id);
        if (dep == null) return ResponseEntity.status(404).body(error("Deposit not found"));
        double amount = toDouble(dep.get("amount"), 0.0);
        adjustJarAmount(toLong(dep.get("jarId")), -amount);
        return ResponseEntity.ok(success("Deposit deleted", "deposit", dep));
    }

    @PostMapping("/api/jars/{id}/recalc")
    public ResponseEntity<Map<String, Object>> recalc(@org.springframework.web.bind.annotation.PathVariable Long id) {
        Map<String, Object> jar = JARS.get(id);
        if (jar == null) return ResponseEntity.status(404).body(error("Jar not found"));
        double current = DEPOSITS.values().stream()
                .filter(d -> id.equals(d.get("jarId")))
                .mapToDouble(d -> toDouble(d.get("amount"), 0.0)).sum();
        jar.put("currentAmount", current);
        jar.put("progress", computeProgress(current, toDouble(jar.get("targetAmount"), 0.0)));
        return ResponseEntity.ok(success("Recalculated", "jar", jar));
    }

    // ================= Helper methods =================
    private static double computeProgress(Double current, Double target) {
        if (target == null || target <= 0) return 0.0;
        return Math.min(100.0, (current == null ? 0.0 : current) / target * 100.0);
    }

    private static void adjustJarAmount(Long jarId, double delta) {
        Map<String, Object> jar = JARS.get(jarId);
        if (jar == null) return;
        double current = toDouble(jar.get("currentAmount"), 0.0) + delta;
        jar.put("currentAmount", current);
        double target = toDouble(jar.get("targetAmount"), 0.0);
        jar.put("progress", computeProgress(current, target));
    }

    private static Double toDouble(Object o, Double def) {
        if (o == null) return def;
        try { return Double.parseDouble(o.toString()); } catch (Exception e) { return def; }
    }
    private static Long toLong(Object o) {
        if (o == null) return null;
        try { return Long.parseLong(o.toString()); } catch (Exception e) { return null; }
    }
    private Map<String, Object> error(String msg) {
        Map<String, Object> m = new HashMap<>();
        m.put("success", false);
        m.put("message", msg);
        return m;
    }
    private Map<String, Object> success(String msg, String key, Object value) {
        Map<String, Object> m = new HashMap<>();
        m.put("success", true);
        m.put("message", msg);
        m.put(key, value);
        return m;
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "TEST SUCCESSFUL - V3 WITH LOGIN");
        response.put("timestamp", System.currentTimeMillis());
        response.put("hasLogin", true);
        return ResponseEntity.ok(response);
    }
}
