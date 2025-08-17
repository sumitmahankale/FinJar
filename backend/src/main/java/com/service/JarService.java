package com.service;

import com.model.*;
import com.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class JarService {
    private final JarRepo jarRepo;
    private final DepositRepo depositRepo;
    public JarService(JarRepo jarRepo, DepositRepo depositRepo) {
        this.jarRepo = jarRepo; this.depositRepo = depositRepo;
    }

    public List<JarEntity> list(UserEntity user) { return jarRepo.findByUser(user); }

    @Transactional
    public JarEntity create(UserEntity user, String name, Double target, String desc) {
        JarEntity j = new JarEntity();
        j.setUser(user);
        j.setName(name);
        j.setTargetAmount(target);
        j.setCurrentAmount(0.0);
        j.setDescription(desc);
        return jarRepo.save(j);
    }

    @Transactional
    public JarEntity update(JarEntity jar, String name, Double target, String desc) {
        if (name != null) jar.setName(name);
        if (target != null) jar.setTargetAmount(target);
        if (desc != null) jar.setDescription(desc);
        return jarRepo.save(jar);
    }

    @Transactional
    public void delete(JarEntity jar) {
        // cascade manually deposits first
        depositRepo.findByJarAndUser(jar, jar.getUser()).forEach(d -> depositRepo.delete(d));
        jarRepo.delete(jar);
    }

    @Transactional
    public DepositEntity addDeposit(UserEntity user, JarEntity jar, Double amount, String description) {
        DepositEntity d = new DepositEntity();
        d.setUser(user);
        d.setJar(jar);
        d.setAmount(amount);
        d.setDescription(description);
        depositRepo.save(d);
        jar.setCurrentAmount(jar.getCurrentAmount() + amount);
        jarRepo.save(jar);
        return d;
    }

    public List<DepositEntity> listDeposits(UserEntity user) { return depositRepo.findByUser(user); }
    public List<DepositEntity> listDepositsForJar(UserEntity user, JarEntity jar) { return depositRepo.findByJarAndUser(jar, user); }
}
