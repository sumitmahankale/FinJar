package com.Service;


import com.Model.Deposite;
import com.Model.Jar;
import com.Repository.DepositRepository;
import com.Repository.JarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DepositeServiceIMPL implements DepositeService {

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private JarRepository jarRepository;

    @Override
    public Deposite addDepositToJar(Long jarId, Deposite deposit) {
        Optional<Jar> optionalJar = jarRepository.findById(jarId);
        if (!optionalJar.isPresent()) {
            throw new RuntimeException("Jar not found with id: " + jarId);
        }

        Jar jar = optionalJar.get();
        deposit.setJar(jar);
        deposit.setTimestamp(LocalDateTime.now());

        // Update jar's savedAmount
        jar.setSavedAmount(jar.getSavedAmount() + deposit.getAmount());

        jarRepository.save(jar); // Update jar
        return depositRepository.save(deposit);
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
    }
}

