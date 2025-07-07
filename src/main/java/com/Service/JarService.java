package com.Service;

import java.util.List;

import com.Model.Jar;

public interface JarService {
	  Jar createJar(Jar jar);
	    List<Jar> getJarsByUserId(Long userId);
	    Jar updateJar(Long id, Jar updatedJar);
	    void deleteJar(Long id);
}
