package com.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Model.Jar;
import com.Repository.JarRepository;

@Service
public class JarServiceIMPL implements JarService{
	
	@Autowired
    private JarRepository jarRepository;

    @Override
    public Jar createJar(Jar jar) {
        jar.setSavedAmount(0.0); // initialize saved amount
        return jarRepository.save(jar);
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
