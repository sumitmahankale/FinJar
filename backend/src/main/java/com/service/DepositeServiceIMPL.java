package com.service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.model.Deposite;
import com.model.Jar;
import com.model.User;
import com.repository.DepositRepository;
import com.repository.JarRepository;
import com.repository.UserRepository;

@Service
public class DepositeServiceIMPL implements DepositeService {

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private JarRepository jarRepository;
    
    @Autowired
    private JarActivityService jarActivityService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Deposite addDepositToJar(Long jarId, Deposite deposit, Long userId) {
        Optional<Jar> optionalJar = jarRepository.findById(jarId);
        if (!optionalJar.isPresent()) {
            throw new RuntimeException("Jar not found with id: " + jarId);
        }

        Jar jar = optionalJar.get();
        deposit.setJar(jar);
        deposit.setTimestamp(LocalDateTime.now());

        // Update savedAmount
        jar.setSavedAmount(jar.getSavedAmount() + deposit.getAmount());

        jarRepository.save(jar); // Save updated jar
        Deposite savedDeposit = depositRepository.save(deposit); // Save deposit

        // 🟩 Log activity with percentage
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        double saved = jar.getSavedAmount();
        double target = jar.getTargetAmount();
        double percentage = (target == 0) ? 100 : (saved / target) * 100;

        String message = "Deposited ₹" + deposit.getAmount() + " to jar: " + jar.getTitle()
                       + " — " + String.format("%.2f", percentage) + "% goal completed.";

        jarActivityService.logActivity(jar, user, message);

        return savedDeposit;
    }


    @Override
    public List<Deposite> getDepositsForJar(Long jarId) {
        return depositRepository.findByJarId(jarId);
    }

    @Override
    public void deleteDeposit(Long depositId) {
        Deposite deposit = depositRepository.findById(depositId)
                .orElseThrow(() -> new RuntimeException("Deposit not found"));

        Jar jar = deposit.getJar();
        jar.setSavedAmount(jar.getSavedAmount() - deposit.getAmount());

        jarRepository.save(jar);
        depositRepository.deleteById(depositId);

        // ✅ Log activity
        User user = jar.getUser(); // if `jar.getUser()` works, otherwise fetch manually
        if (user == null) {
            user = userRepository.findById(deposit.getJar().getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        jarActivityService.logActivity(
            jar,
            user,
            "Deleted deposit of ₹" + deposit.getAmount() + " from jar: " + jar.getTitle()
        );
    }

}

