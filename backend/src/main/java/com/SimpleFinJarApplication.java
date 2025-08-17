package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import org.springframework.transaction.annotation.Transactional;

import com.model.UserEntity;
import com.model.JarEntity;
import com.model.DepositEntity;
import com.repo.UserRepo;
import com.repo.JarRepo;
import com.repo.DepositRepo;
import com.service.AuthService;
import com.service.JarService;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootApplication
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://finjar-chi.vercel.app", "https://finjar-frontend.vercel.app", "https://finjar.vercel.app"})
public class SimpleFinJarApplication {

    private final UserRepo userRepo;
    private final JarRepo jarRepo;
    private final DepositRepo depositRepo;
    private final AuthService authService;
    private final JarService jarService;
    private final DataSource dataSource;

    public SimpleFinJarApplication(UserRepo userRepo, JarRepo jarRepo, DepositRepo depositRepo,
                                   AuthService authService, JarService jarService, DataSource dataSource) {
        this.userRepo = userRepo;
        this.jarRepo = jarRepo;
        this.depositRepo = depositRepo;
        this.authService = authService;
        this.jarService = jarService;
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void seedIfEmpty() {
        if (userRepo.count() == 0) {
            UserEntity demo = authService.register("john@example.com", "John Doe", "password");
            JarEntity j1 = jarService.create(demo, "Emergency Fund", 1000.0, "Basic safety net");
            j1.setCurrentAmount(500.0); jarRepo.save(j1);
            JarEntity j2 = jarService.create(demo, "Vacation", 2500.0, "Trip to mountains");
            j2.setCurrentAmount(850.0); jarRepo.save(j2);
            JarEntity j3 = jarService.create(demo, "New Laptop", 1800.0, "Upgrade gear");
            j3.setCurrentAmount(300.0); jarRepo.save(j3);
            jarService.addDeposit(demo, j1, 300.0, "Initial seed");
            jarService.addDeposit(demo, j1, 200.0, "Monthly save");
        }
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
    
    @GetMapping("/api/db/ping")
    public ResponseEntity<Map<String,Object>> dbPing() {
        Map<String,Object> resp = new HashMap<>();
        long start = System.currentTimeMillis();
        try (Connection c = dataSource.getConnection()) {
            if (c.isValid(5)) {
                resp.put("success", true);
                resp.put("latencyMs", System.currentTimeMillis() - start);
                resp.put("message", "DB connection OK");
                return ResponseEntity.ok(resp);
            } else {
                resp.put("success", false);
                resp.put("message", "Connection not valid");
                return ResponseEntity.status(500).body(resp);
            }
        } catch (SQLException e) {
            resp.put("success", false);
            resp.put("error", e.getClass().getSimpleName());
            resp.put("message", e.getMessage());
            return ResponseEntity.status(500).body(resp);
        }
    }
    
    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) Map<String, Object> loginRequest) {
        if (loginRequest == null || !loginRequest.containsKey("email") || !loginRequest.containsKey("password")) {
            return ResponseEntity.badRequest().body(error("Missing email or password"));
        }
        String email = String.valueOf(loginRequest.get("email")).toLowerCase();
        String password = String.valueOf(loginRequest.get("password"));
        UserEntity user = authService.authenticate(email, password);
        if (user == null) return ResponseEntity.status(401).body(error("Invalid credentials"));
        String token = generateJwt(user.getEmail(), user.getName(), user.getId());
        Map<String,Object> sanitized = new HashMap<>();
        sanitized.put("id", user.getId());
        sanitized.put("email", user.getEmail());
        sanitized.put("name", user.getName());
        Map<String,Object> resp = success("Login successful", "user", sanitized);
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
        try {
            UserEntity user = authService.register(email, name, password);
            String token = generateJwt(user.getEmail(), user.getName(), user.getId());
            Map<String,Object> sanitized = new HashMap<>();
            sanitized.put("id", user.getId());
            sanitized.put("email", user.getEmail());
            sanitized.put("name", user.getName());
            Map<String,Object> resp = success("Registration successful", "user", sanitized);
            resp.put("token", token);
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body(error(e.getMessage()));
        }
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
            Map<String,String> env = System.getenv();
            String secret = env.getOrDefault("FINJAR_JWT_SECRET", env.getOrDefault("JWT_SECRET", "ChangeMe_AtLeast32Chars_Long_Secret_Key_123"));
            String expMsStr = env.getOrDefault("FINJAR_JWT_EXPIRATION_MS", env.getOrDefault("JWT_EXPIRATION", "3600000"));
            long expMs;
            try { expMs = Long.parseLong(expMsStr.trim()); } catch (Exception e) { expMs = 3600000L; }
            // If value looks like seconds (e.g. 86400), convert to ms.
            if (expMs > 0 && expMs < 1000000L) { // < ~16.6 minutes in ms -> assume seconds
                expMs = expMs * 1000L;
            }
            jwtUtil = new com.util.JwtUtil(secret, expMs);
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
            return userRepo.findById(uid).map(u -> {
                Map<String,Object> m = new HashMap<>();
                m.put("id", u.getId());
                m.put("email", u.getEmail());
                m.put("name", u.getName());
                return m;
            }).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    // legacy sanitizeUser removed after JPA migration

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
    Map<String,Object> sanitized = new HashMap<>();
    sanitized.put("id", user.get("id"));
    sanitized.put("email", user.get("email"));
    sanitized.put("name", user.get("name"));
    return ResponseEntity.ok(success("Profile fetched", "user", sanitized));
    }

    @PutMapping("/api/user/update")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @RequestBody(required = false) Map<String, Object> body) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        UserEntity userEntity = userRepo.findById((Long) u.get("id")).orElse(null);
        if (userEntity == null) return unauthorized();
        if (body == null) body = new HashMap<>();
        if (body.containsKey("name")) userEntity.setName(String.valueOf(body.get("name")));
        if (body.containsKey("email")) {
            String newEmail = String.valueOf(body.get("email")).toLowerCase();
            if (!newEmail.equals(userEntity.getEmail()) && userRepo.existsByEmail(newEmail)) {
                return ResponseEntity.status(409).body(error("Email already in use"));
            }
            userEntity.setEmail(newEmail);
        }
        userRepo.save(userEntity);
        Map<String,Object> sanitized = new HashMap<>();
        sanitized.put("id", userEntity.getId());
        sanitized.put("email", userEntity.getEmail());
        sanitized.put("name", userEntity.getName());
        return ResponseEntity.ok(success("Profile updated", "user", sanitized));
    }
    
    @GetMapping("/api/jars")
    public ResponseEntity<?> getJars(@RequestHeader(value = "Authorization", required = false) String auth,
                                      @RequestParam(name = "flat", required = false) Integer flat) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        UserEntity userEntity = userRepo.findById((Long) u.get("id")).orElse(null);
        if (userEntity == null) return unauthorized();
        List<Map<String,Object>> list = jarService.list(userEntity).stream().map(this::jarToMap).collect(Collectors.toList());
        if (flat != null && flat == 1) return ResponseEntity.ok(list);
        Map<String,Object> response = new HashMap<>();
        response.put("success", true);
        response.put("total", list.size());
        response.put("jars", list);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/jars")
    public ResponseEntity<Map<String, Object>> createJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @RequestBody(required = false) Map<String, Object> body) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        if (body == null) return ResponseEntity.badRequest().body(error("Missing request body"));
        if (!body.containsKey("name") && body.containsKey("title")) body.put("name", body.get("title"));
        if (!body.containsKey("name") || !body.containsKey("targetAmount")) {
            return ResponseEntity.badRequest().body(error("Missing required fields: name (or title), targetAmount"));
        }
        UserEntity userEntity = userRepo.findById((Long) u.get("id")).orElse(null);
        if (userEntity == null) return unauthorized();
        JarEntity jar = jarService.create(userEntity, String.valueOf(body.get("name")), toDouble(body.get("targetAmount"),0.0), String.valueOf(body.getOrDefault("description","")));
        return ResponseEntity.ok(success("Jar created", "jar", jarToMap(jar)));
    }

    @PutMapping("/api/jars/{id}")
    public ResponseEntity<Map<String, Object>> updateJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @PathVariable Long id,
                                                         @RequestBody(required = false) Map<String, Object> body) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        JarEntity jar = jarRepo.findById(id).orElse(null);
        if (jar == null) return ResponseEntity.status(404).body(error("Jar not found"));
        if (!jar.getUser().getId().equals(u.get("id"))) return ResponseEntity.status(403).body(error("Forbidden"));
        if (body != null) {
            jarService.update(jar,
                body != null && body.containsKey("name") ? String.valueOf(body.get("name")) : null,
                body != null && body.containsKey("targetAmount") ? toDouble(body.get("targetAmount"), jar.getTargetAmount()) : null,
                body != null && body.containsKey("description") ? String.valueOf(body.get("description")) : null);
        }
        return ResponseEntity.ok(success("Jar updated", "jar", jarToMap(jar)));
    }

    @DeleteMapping("/api/jars/{id}")
    public ResponseEntity<Map<String, Object>> deleteJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                         @PathVariable Long id) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        JarEntity jar = jarRepo.findById(id).orElse(null);
        if (jar == null) return ResponseEntity.status(404).body(error("Jar not found"));
        if (!jar.getUser().getId().equals(u.get("id"))) return ResponseEntity.status(403).body(error("Forbidden"));
        jarService.delete(jar);
        return ResponseEntity.ok(success("Jar deleted", "jar", jarToMap(jar)));
    }

    @PostMapping("/api/deposits")
    public ResponseEntity<Map<String, Object>> createDeposit(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @RequestBody(required = false) Map<String, Object> body) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        if (body == null || !body.containsKey("jarId") || !body.containsKey("amount")) return ResponseEntity.badRequest().body(error("Missing required fields: jarId, amount"));
        JarEntity jar = jarRepo.findById(toLong(body.get("jarId"))).orElse(null);
        if (jar == null || !jar.getUser().getId().equals(u.get("id"))) return ResponseEntity.badRequest().body(error("Jar not found"));
        UserEntity userEntity = userRepo.findById((Long) u.get("id")).orElse(null);
        if (userEntity == null) return unauthorized();
        Double amount = toDouble(body.get("amount"), 0.0);
        String description = String.valueOf(body.getOrDefault("description", ""));
        DepositEntity dep = jarService.addDeposit(userEntity, jar, amount, description);
        return ResponseEntity.ok(success("Deposit added", "deposit", depositToMap(dep)));
    }

    // Path variant used by frontend: /api/deposits/jar/{jarId}
    @PostMapping("/api/deposits/jar/{jarId}")
    public ResponseEntity<Map<String, Object>> createDepositForJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                                                   @PathVariable Long jarId,
                                                                   @RequestBody(required = false) Map<String, Object> body) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        if (jarId == null) return ResponseEntity.badRequest().body(error("Missing jarId path variable"));
        JarEntity jar = jarRepo.findById(jarId).orElse(null);
        if (jar == null || !jar.getUser().getId().equals(u.get("id"))) return ResponseEntity.badRequest().body(error("Jar not found"));
        if (body == null || !body.containsKey("amount")) return ResponseEntity.badRequest().body(error("Missing required field: amount"));
        UserEntity userEntity = userRepo.findById((Long) u.get("id")).orElse(null);
        if (userEntity == null) return unauthorized();
        Double amount = toDouble(body.get("amount"), 0.0);
        String description = String.valueOf(body.getOrDefault("description", ""));
        DepositEntity dep = jarService.addDeposit(userEntity, jar, amount, description);
        return ResponseEntity.ok(success("Deposit added", "deposit", depositToMap(dep)));
    }

    @GetMapping("/api/deposits")
    public ResponseEntity<Map<String, Object>> listDeposits(@RequestHeader(value = "Authorization", required = false) String auth,
                                                            @org.springframework.web.bind.annotation.RequestParam(name = "jarId", required = false) Long jarId) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        UserEntity userEntity = userRepo.findById((Long) u.get("id")).orElse(null);
        if (userEntity == null) return unauthorized();
        List<DepositEntity> deps;
        if (jarId != null) {
            JarEntity jar = jarRepo.findById(jarId).orElse(null);
            if (jar == null || !jar.getUser().getId().equals(userEntity.getId())) return ResponseEntity.status(404).body(error("Jar not found"));
            deps = jarService.listDepositsForJar(userEntity, jar);
        } else {
            deps = jarService.listDeposits(userEntity);
        }
        List<Map<String,Object>> list = deps.stream().map(this::depositToMap).collect(Collectors.toList());
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("total", list.size());
        resp.put("deposits", list);
        return ResponseEntity.ok(resp);
    }

    // Convenience legacy style: /api/deposits/jar/{jarId} returning just an array
    @GetMapping("/api/deposits/jar/{jarId}")
    public ResponseEntity<?> listDepositsByJar(@RequestHeader(value = "Authorization", required = false) String auth,
                                               @PathVariable Long jarId,
                                               @RequestParam(name = "flat", required = false) Integer flat) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        JarEntity jar = jarRepo.findById(jarId).orElse(null);
        if (jar == null || !jar.getUser().getId().equals(u.get("id"))) return ResponseEntity.status(404).body(error("Jar not found"));
        UserEntity userEntity = userRepo.findById((Long) u.get("id")).orElse(null);
        if (userEntity == null) return unauthorized();
        List<Map<String,Object>> list = jarService.listDepositsForJar(userEntity, jar).stream().map(this::depositToMap).collect(Collectors.toList());
        if (flat == null || flat != 0) return ResponseEntity.ok(list);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("total", list.size());
        resp.put("deposits", list);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/api/deposits/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateDeposit(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @PathVariable Long id,
                                                             @RequestBody(required = false) Map<String, Object> body) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        DepositEntity dep = depositRepo.findById(id).orElse(null);
        if (dep == null) return ResponseEntity.status(404).body(error("Deposit not found"));
        if (!dep.getUser().getId().equals(u.get("id"))) return ResponseEntity.status(403).body(error("Forbidden"));
        double oldAmount = dep.getAmount();
        if (body != null) {
            if (body.containsKey("amount")) {
                double newAmt = toDouble(body.get("amount"), oldAmount);
                dep.setAmount(newAmt);
                double delta = newAmt - oldAmount;
                JarEntity jar = dep.getJar();
                jar.setCurrentAmount(jar.getCurrentAmount() + delta);
                jarRepo.save(jar);
            }
            if (body.containsKey("description")) dep.setDescription(String.valueOf(body.get("description")));
        }
        depositRepo.save(dep);
        return ResponseEntity.ok(success("Deposit updated", "deposit", depositToMap(dep)));
    }

    @DeleteMapping("/api/deposits/{id}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteDeposit(@RequestHeader(value = "Authorization", required = false) String auth,
                                                             @PathVariable Long id) {
        Map<String,Object> u = authUser(auth);
        if (u == null) return unauthorized();
        DepositEntity dep = depositRepo.findById(id).orElse(null);
        if (dep == null) return ResponseEntity.status(404).body(error("Deposit not found"));
        if (!dep.getUser().getId().equals(u.get("id"))) return ResponseEntity.status(403).body(error("Forbidden"));
        JarEntity jar = dep.getJar();
        jar.setCurrentAmount(jar.getCurrentAmount() - dep.getAmount());
        depositRepo.delete(dep);
        jarRepo.save(jar);
        return ResponseEntity.ok(success("Deposit deleted", "deposit", depositToMap(dep)));
    }

    @PostMapping("/api/jars/{id}/recalc")
    public ResponseEntity<Map<String, Object>> recalc(@org.springframework.web.bind.annotation.PathVariable Long id) {
        JarEntity jar = jarRepo.findById(id).orElse(null);
        if (jar == null) return ResponseEntity.status(404).body(error("Jar not found"));
        double current = depositRepo.findByJarAndUser(jar, jar.getUser()).stream().mapToDouble(DepositEntity::getAmount).sum();
        jar.setCurrentAmount(current);
        jarRepo.save(jar);
        return ResponseEntity.ok(success("Recalculated", "jar", jarToMap(jar)));
    }

    // ================= Helper methods =================
    private static double computeProgress(Double current, Double target) {
        if (target == null || target <= 0) return 0.0;
        return Math.min(100.0, (current == null ? 0.0 : current) / target * 100.0);
    }

    // In-memory adjustJarAmount removed; persistence handles aggregation

    private Map<String,Object> jarToMap(JarEntity j) {
        Map<String,Object> m = new HashMap<>();
        m.put("id", j.getId());
        m.put("name", j.getName());
        m.put("targetAmount", j.getTargetAmount());
        m.put("currentAmount", j.getCurrentAmount());
        m.put("description", j.getDescription());
        m.put("createdAt", j.getCreatedAt() == null ? null : j.getCreatedAt().toEpochMilli());
        m.put("progress", computeProgress(j.getCurrentAmount(), j.getTargetAmount()));
        m.put("userId", j.getUser() != null ? j.getUser().getId() : null);
        return m;
    }

    private Map<String,Object> depositToMap(DepositEntity d) {
        Map<String,Object> m = new HashMap<>();
        m.put("id", d.getId());
        m.put("jarId", d.getJar() != null ? d.getJar().getId() : null);
        m.put("amount", d.getAmount());
        m.put("description", d.getDescription());
        m.put("createdAt", d.getCreatedAt() == null ? null : d.getCreatedAt().toEpochMilli());
        m.put("userId", d.getUser() != null ? d.getUser().getId() : null);
        return m;
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
