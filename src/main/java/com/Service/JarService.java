package com.service;

import java.util.List;

import com.model.Jar;

public interface JarService {
	    List<Jar> getJarsByUserId(Long userId);
	    Jar updateJar(Long id, Jar updatedJar);
	    void deleteJar(Long id);
	    Jar createJar(Jar jar, Long userId);
	    Jar createJarFromToken(Jar jar, String authHeader);
	    List<Jar> getJarsByToken(String authHeader);

	    
	    
}
