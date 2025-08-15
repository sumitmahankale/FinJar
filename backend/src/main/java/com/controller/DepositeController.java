package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.model.Deposite;
import com.model.User;
import com.service.DepositeService;
import com.service.UserService;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://finjar-chi.vercel.app", "https://finjar-frontend.vercel.app"}, allowCredentials = "true")
public class DepositeController {

    @Autowired
    private DepositeService depositService;

    @Autowired
    private UserService userService;

    // ✅ Add deposit using authenticated user and jar ID
    @PostMapping("/jar/{jarId}")
    public Deposite addDepositToJar(@PathVariable Long jarId,
                                    @RequestBody Deposite deposit,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        // Extract email from authenticated user
        String userEmail = userDetails.getUsername();

        // Fetch user and get userId
        User user = userService.getUserByEmail(userEmail);
        Long userId = user.getId();

        return depositService.addDepositToJar(jarId, deposit, userId);
    }

    // ✅ Get all deposits for a given jar
    @GetMapping("/jar/{jarId}")
    public List<Deposite> getDepositsForJar(@PathVariable Long jarId) {
        return depositService.getDepositsForJar(jarId);
    }

    // ✅ Delete a deposit by ID
    @DeleteMapping("/{depositId}")
    public void deleteDeposit(@PathVariable Long depositId) {
        depositService.deleteDeposit(depositId);
    }
}
