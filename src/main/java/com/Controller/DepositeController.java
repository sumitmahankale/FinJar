package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.model.Deposite;
import com.service.DepositeService;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin(origins = "http://localhost:5173")
public class DepositeController {

    @Autowired
    private DepositeService depositService;

    // ➕ Add deposit to a specific jar by a user
    @PostMapping("/jar/{jarId}/user/{userId}")
    public Deposite addDepositToJar(@PathVariable Long jarId, @PathVariable Long userId, @RequestBody Deposite deposit) {
        return depositService.addDepositToJar(jarId, deposit, userId);
    }

    // 📥 Get all deposits for a specific jar
    @GetMapping("/jar/{jarId}")
    public List<Deposite> getDepositsForJar(@PathVariable Long jarId) {
        return depositService.getDepositsForJar(jarId);
    }

    // ❌ Delete a deposit by ID
    @DeleteMapping("/{depositId}")
    public void deleteDeposit(@PathVariable Long depositId) {
        depositService.deleteDeposit(depositId);
    }
}
