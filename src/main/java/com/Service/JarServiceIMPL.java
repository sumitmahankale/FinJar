package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.model.Jar;
import com.model.User;
import com.repository.DepositRepository;
import com.repository.JarRepository;
import com.repository.UserRepository;

@Service
public class JarServiceIMPL implements JarService{
	
	@Autowired
    private JarRepository jarRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JarActivityService jarActivityService;

	@Autowired
	private DepositRepository depositRepository;

    @Override
    public Jar createJar(Jar jar, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        jar.setUser(user);
        jar.setSavedAmount(0.0); // default

        Jar savedJar = jarRepository.save(jar);

        // ✅ Log activity here
        jarActivityService.logActivity(savedJar, user, "Created Jar: " + savedJar.getTitle());

        return savedJar;
    }

    @Override
    public List<Jar> getJarsByUserId(Long userId) {
        return jarRepository.findByUserId(userId);
    }

    @Override
    public Jar updateJar(Long id, Jar updatedJar) {
        return jarRepository.findById(id)
                .map(jar -> {
                    jar.setTitle(updatedJar.getTitle());
                    jar.setTargetAmount(updatedJar.getTargetAmount());
                    return jarRepository.save(jar);
                })
                .orElseThrow(() -> new RuntimeException("Jar not found with id " + id));
    }

    @Override
    public void deleteJar(Long id) {
        jarRepository.deleteById(id);
    }
}
