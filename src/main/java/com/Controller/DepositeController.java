package com.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Model.Deposite;
import com.Service.DepositeService;

@RestController
@RequestMapping("/api/deposits")
@CrossOrigin
public class DepositeController {

    @Autowired
    private DepositeService depositService;

    // ➕ Add deposit to a specific jar
    @PostMapping("/jar/{jarId}")
    public Deposite addDepositToJar(@PathVariable Long jarId, @RequestBody Deposite deposit) {
        return depositService.addDepositToJar(jarId, deposit);
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
