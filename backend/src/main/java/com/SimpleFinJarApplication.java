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
    private static final Map<Long, Map<String, Object>> USERS = new ConcurrentHashMap<>(); // id -> user {id,email,name,passwordHash}
    private static final Map<String, Long> USER_EMAIL_INDEX = new ConcurrentHashMap<>(); // email -> userId
    private static final AtomicLong JAR_ID_SEQ = new AtomicLong(0);
    private static final AtomicLong DEPOSIT_ID_SEQ = new AtomicLong(0);
    private static final AtomicLong USER_ID_SEQ = new AtomicLong(0);

    static {
        // Seed demo user (password: password)
        Map<String,Object> demo = createUserInternal("john@example.com", "John Doe", "password");
        seedJar(demo, "Emergency Fund", 1000.0, 500.0, "Basic safety net");
        seedJar(demo, "Vacation", 2500.0, 850.0, "Trip to mountains");
        seedJar(demo, "New Laptop", 1800.0, 300.0, "Upgrade gear");
        seedDeposit(demo, 1L, 300.0, "Initial seed");
        seedDeposit(demo, 1L, 200.0, "Monthly save");
    }

    private static String hashPassword(String raw) {
        return Integer.toHexString((raw == null ? "" : raw).hashCode());
    }

    private static Map<String,Object> createUserInternal(String email, String name, String password) {
        long id = USER_ID_SEQ.incrementAndGet();
        Map<String,Object> user = new HashMap<>();
        user.put("id", id);
        user.put("email", email.toLowerCase());
        user.put("name", name);
        user.put("passwordHash", hashPassword(password));
        USERS.put(id, user);
        USER_EMAIL_INDEX.put(email.toLowerCase(), id);
        return user;
    }

    private static void seedJar(Map<String,Object> user, String name, Double target, Double current, String description) {
        long id = JAR_ID_SEQ.incrementAndGet();
        Map<String, Object> jar = new HashMap<>();
        jar.put("id", id);
        jar.put("name", name);
        jar.put("targetAmount", target);
        jar.put("currentAmount", current);
        jar.put("description", description);
        jar.put("createdAt", System.currentTimeMillis());
        jar.put("progress", computeProgress(current, target));
        jar.put("userId", user.get("id"));
        JARS.put(id, jar);
    }

    private static void seedDeposit(Map<String,Object> user, Long jarId, Double amount, String description) {
        long id = DEPOSIT_ID_SEQ.incrementAndGet();
        Map<String, Object> deposit = new HashMap<>();
        deposit.put("id", id);
        deposit.put("jarId", jarId);
        deposit.put("amount", amount);
        deposit.put("description", description);
        deposit.put("createdAt", System.currentTimeMillis());
        deposit.put("userId", user.get("id"));
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
        if (loginRequest == null || !loginRequest.containsKey("email") || !loginRequest.containsKey("password")) {
            return ResponseEntity.badRequest().body(error("Missing email or password"));
        }
        String email = String.valueOf(loginRequest.get("email")).toLowerCase();
        String password = String.valueOf(loginRequest.get("password"));
        Long userId = USER_EMAIL_INDEX.get(email);
        if (userId == null) return ResponseEntity.status(401).body(error("Invalid credentials"));
        Map<String,Object> user = USERS.get(userId);
        if (user == null || !hashPassword(password).equals(user.get("passwordHash"))) {
            return ResponseEntity.status(401).body(error("Invalid credentials"));
        }
        String token = generateJwt(email, String.valueOf(user.get("name")), userId);
        Map<String,Object> resp = success("Login successful", "user", sanitizeUser(user));
        resp.put("token", token);
        return ResponseEntity.ok(resp);
    }

    // Alias endpoint without /api prefix (fallback for older frontend bundles)
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> loginAlias(@RequestBody(required = false) Map<String, Object> loginRequest) {
        return login(loginRequest);
    }
    
    @PostMapping("/api/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody(required = false) Map<String, Object> registerRequest) {
        if (registerRequest == null || !registerRequest.containsKey("email") || !registerRequest.containsKey("password") || !registerRequest.containsKey("name")) {
            return ResponseEntity.badRequest().body(error("Missing required fields: name, email, password"));
        }
        String email = String.valueOf(registerRequest.get("email")).toLowerCase();
        String name = String.valueOf(registerRequest.get("name"));
        String password = String.valueOf(registerRequest.get("password"));
        if (USER_EMAIL_INDEX.containsKey(email)) {
            return ResponseEntity.status(409).body(error("Email already registered"));
        }
        Map<String,Object> user = createUserInternal(email, name, password);
        String token = generateJwt(email, name, (Long) user.get("id"));
        Map<String,Object> resp = success("Registration successful", "user", sanitizeUser(user));
        resp.put("token", token);
        return ResponseEntity.ok(resp);
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
    private String generateJwt(String email, String name, Long userId) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("name", name);
        claims.put("role", "USER");
        claims.put("userId", userId);
        return jwt().generateToken(email, claims);
    }
    private boolean validToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7);
        return jwt().isValid(token);
    }

    private Map<String,Object> authUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        try {
            io.jsonwebtoken.Jws<io.jsonwebtoken.Claims> jws = jwt().parse(token);
            Object uidObj = jws.getBody().get("userId");
            if (uidObj == null) return null;
            Long uid = Long.parseLong(uidObj.toString());
            return USERS.get(uid);
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String,Object> sanitizeUser(Map<String,Object> user) {
        Map<String,Object> clean = new HashMap<>();
        clean.put("id", user.get("id"));
        clean.put("email", user.get("email"));
        clean.put("name", user.get("name"));
        return clean;
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
        Map<String,Object> user = authUser(auth);
        if (user == null) return unauthorized();
        return ResponseEntity.ok(success("Profile fetched", "user", sanitizeUser(user)));
    }

    @PutMapping("/api/user/update")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @RequestBody(required = false) Map<String, Object> body) {
        Map<String,Object> user = authUser(auth);
        if (user == null) return unauthorized();
        if (body == null) body = new HashMap<>();
        if (body.containsKey("name")) user.put("name", body.get("name"));
        if (body.containsKey("email")) {
            String newEmail = String.valueOf(body.get("email")).toLowerCase();
            if (!newEmail.equals(user.get("email")) && USER_EMAIL_INDEX.containsKey(newEmail)) {
                return ResponseEntity.status(409).body(error("Email already in use"));
            }
            USER_EMAIL_INDEX.remove(user.get("email"));
            user.put("email", newEmail);
            USER_EMAIL_INDEX.put(newEmail, (Long) user.get("id"));
        }
        return ResponseEntity.ok(success("Profile updated", "user", sanitizeUser(user)));
    }
    
    @GetMapping("/api/jars")
    public ResponseEntity<?> getJars(@RequestHeader(value = "Authorization", required = false) String auth,
                                      @RequestParam(name = "flat", required = false) Integer flat) {
        Map<String,Object> user = authUser(auth);
        if (user == null) return unauthorized();
        Long uid = (Long) user.get("id");
        List<Map<String, Object>> list = JARS.values().stream().filter(j -> uid.equals(j.get("userId"))).collect(Collectors.toList());
        if (flat != null && flat == 1) {
            return ResponseEntity.ok(list);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", list.size());
        response.put("jars", list);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/jars")
    public ResponseEntity<Map<String, Object>> createJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @RequestBody(required = false) Map<String, Object> body) {
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
        if (body == null) {
            return ResponseEntity.badRequest().body(error("Missing request body"));
        }
        // Accept legacy frontend field "title" as an alias for "name"
        if (!body.containsKey("name") && body.containsKey("title")) {
            body.put("name", body.get("title"));
        }
        if (!body.containsKey("name") || !body.containsKey("targetAmount")) {
            return ResponseEntity.badRequest().body(error("Missing required fields: name (or title), targetAmount"));
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
    jar.put("userId", user.get("id"));
    JARS.put(id, jar);
        return ResponseEntity.ok(success("Jar created", "jar", jar));
    }

    @PutMapping("/api/jars/{id}")
    public ResponseEntity<Map<String, Object>> updateJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @PathVariable Long id,
                                                         @RequestBody(required = false) Map<String, Object> body) {
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
    Map<String, Object> jar = JARS.get(id);
        if (jar == null) return ResponseEntity.status(404).body(error("Jar not found"));
    if (!user.get("id").equals(jar.get("userId"))) return ResponseEntity.status(403).body(error("Forbidden"));
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
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
    Map<String, Object> removed = JARS.get(id);
    if (removed == null) return ResponseEntity.status(404).body(error("Jar not found"));
    if (!user.get("id").equals(removed.get("userId"))) return ResponseEntity.status(403).body(error("Forbidden"));
    JARS.remove(id);
    DEPOSITS.values().removeIf(d -> id.equals(d.get("jarId")) && user.get("id").equals(d.get("userId")));
        return ResponseEntity.ok(success("Jar deleted", "jar", removed));
    }

    @PostMapping("/api/deposits")
    public ResponseEntity<Map<String, Object>> createDeposit(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @RequestBody(required = false) Map<String, Object> body) {
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
        if (body == null || !body.containsKey("jarId") || !body.containsKey("amount")) {
            return ResponseEntity.badRequest().body(error("Missing required fields: jarId, amount"));
        }
        Long jarId = toLong(body.get("jarId"));
    Map<String,Object> jar = JARS.get(jarId);
    if (jar == null || !user.get("id").equals(jar.get("userId"))) {
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
    deposit.put("userId", user.get("id"));
    DEPOSITS.put(id, deposit);
        // Update jar current amount & progress
        adjustJarAmount(jarId, amount);
        return ResponseEntity.ok(success("Deposit added", "deposit", deposit));
    }

    // Path variant used by frontend: /api/deposits/jar/{jarId}
    @PostMapping("/api/deposits/jar/{jarId}")
    public ResponseEntity<Map<String, Object>> createDepositForJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                                   @PathVariable Long jarId,
                                                                   @RequestBody(required = false) Map<String, Object> body) {
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
    if (jarId == null) return ResponseEntity.badRequest().body(error("Missing jarId path variable"));
    Map<String,Object> jar = JARS.get(jarId);
    if (jar == null || !user.get("id").equals(jar.get("userId"))) return ResponseEntity.badRequest().body(error("Jar not found"));
        if (body == null || !body.containsKey("amount")) return ResponseEntity.badRequest().body(error("Missing required field: amount"));
        Double amount = toDouble(body.get("amount"), 0.0);
        String description = String.valueOf(body.getOrDefault("description", ""));
        long id = DEPOSIT_ID_SEQ.incrementAndGet();
        Map<String, Object> deposit = new HashMap<>();
        deposit.put("id", id);
        deposit.put("jarId", jarId);
        deposit.put("amount", amount);
        deposit.put("description", description);
    deposit.put("createdAt", System.currentTimeMillis());
    deposit.put("userId", user.get("id"));
    DEPOSITS.put(id, deposit);
        adjustJarAmount(jarId, amount);
        return ResponseEntity.ok(success("Deposit added", "deposit", deposit));
    }

    @GetMapping("/api/deposits")
    public ResponseEntity<Map<String, Object>> listDeposits(@RequestHeader(value = "Authorization", required = false) String auth,
                                                            @org.springframework.web.bind.annotation.RequestParam(name = "jarId", required = false) Long jarId) {
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
    Long uid = (Long) user.get("id");
    List<Map<String, Object>> list = DEPOSITS.values().stream().filter(d -> uid.equals(d.get("userId"))).collect(Collectors.toList());
        if (jarId != null) {
            list = list.stream().filter(d -> jarId.equals(d.get("jarId"))).collect(Collectors.toList());
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", list.size());
        response.put("deposits", list);
        return ResponseEntity.ok(response);
    }

    // Convenience legacy style: /api/deposits/jar/{jarId} returning just an array
    @GetMapping("/api/deposits/jar/{jarId}")
    public ResponseEntity<?> listDepositsByJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                               @PathVariable Long jarId,
                                               @RequestParam(name = "flat", required = false) Integer flat) {
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
    List<Map<String, Object>> list = DEPOSITS.values().stream()
        .filter(d -> jarId.equals(d.get("jarId")) && user.get("id").equals(d.get("userId")))
        .collect(Collectors.toList());
        if (flat == null || flat != 0) {
            return ResponseEntity.ok(list);
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
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
    Map<String, Object> dep = DEPOSITS.get(id);
        if (dep == null) return ResponseEntity.status(404).body(error("Deposit not found"));
    if (!user.get("id").equals(dep.get("userId"))) return ResponseEntity.status(403).body(error("Forbidden"));
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
    Map<String,Object> user = authUser(auth);
    if (user == null) return unauthorized();
    Map<String, Object> dep = DEPOSITS.get(id);
        if (dep == null) return ResponseEntity.status(404).body(error("Deposit not found"));
    if (!user.get("id").equals(dep.get("userId"))) return ResponseEntity.status(403).body(error("Forbidden"));
    DEPOSITS.remove(id);
        double amount = toDouble(dep.get("amount"), 0.0);
        adjustJarAmount(toLong(dep.get("jarId")), -amount);
        return ResponseEntity.ok(success("Deposit deleted", "deposit", dep));
    }

    @PostMapping("/api/jars/{id}/recalc")
    public ResponseEntity<Map<String, Object>> recalc(@org.springframework.web.bind.annotation.PathVariable Long id) {
        Map<String, Object> jar = JARS.get(id);
        if (jar == null) return ResponseEntity.status(404).body(error("Jar not found"));
    double current = DEPOSITS.values().stream()
        .filter(d -> id.equals(d.get("jarId")) && jar.get("userId").equals(d.get("userId")))
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
