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

  
    @PostMapping("/jar/{jarId}/user/{userId}")
    public Deposite addDepositToJar(@PathVariable Long jarId, @PathVariable Long userId, @RequestBody Deposite deposit) {
        return depositService.addDepositToJar(jarId, deposit, userId);
    }

    @GetMapping("/jar/{jarId}")
    public List<Deposite> getDepositsForJar(@PathVariable Long jarId) {
        return depositService.getDepositsForJar(jarId);
    }


    @DeleteMapping("/{depositId}")
    public void deleteDeposit(@PathVariable Long depositId) {
        depositService.deleteDeposit(depositId);
    }
}
