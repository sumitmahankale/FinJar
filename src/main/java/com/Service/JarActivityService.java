package com.service;

import java.util.List;

import com.model.Jar;
import com.model.JarActivity;
import com.model.User;

public interface JarActivityService {
    void logActivity(Jar jar, User user, String action);
    List<JarActivity> getJarActivities(Jar jar);
    
}
