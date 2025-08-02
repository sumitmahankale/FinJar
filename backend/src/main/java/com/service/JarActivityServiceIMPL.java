package com.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.model.Jar;
import com.model.JarActivity;
import com.model.User;
import com.repository.JarActivityRepository;

@Service
public class JarActivityServiceIMPL implements JarActivityService {

    @Autowired
    private JarActivityRepository jarActivityRepository;

    @Override
    public void logActivity(Jar jar, User user, String action) {
        JarActivity activity = new JarActivity();
        activity.setJar(jar);
        activity.setUser(user);
        activity.setAction(action);
        activity.setTimestamp(LocalDateTime.now());
        jarActivityRepository.save(activity);
    }

    @Override
    public List<JarActivity> getJarActivities(Jar jar) {
        return jarActivityRepository.findByJarOrderByTimestampDesc(jar);
    }
}
