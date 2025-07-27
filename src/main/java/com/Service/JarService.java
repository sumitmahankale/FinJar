package com.service;

import java.util.List;
import java.util.Optional;
import com.model.Jar;

public interface JarService {
    
    // Method for creating jar with token (your existing method)
    Jar createJarFromToken(Jar jar, String authHeader);
    
    // Method for creating jar with user ID (the missing one)
    Jar createJar(Jar jar, Long userId);
    
    // Method for getting jars by token (your existing method)
    List<Jar> getJarsByToken(String authHeader);
    
    // Method for getting jars by user ID
    List<Jar> getJarsByUserId(Long userId);
    
    // Update jar method
    Jar updateJar(Long jarId, Jar jar);
    
    // Delete jar method
    void deleteJar(Long jarId);
    
    // Get jar by ID (optional, add if needed)
    Optional<Jar> getJarById(Long jarId);
}