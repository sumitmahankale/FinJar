package com.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.Jar;
import com.model.JarActivity;
import com.repository.JarRepository;
import com.service.JarActivityService;

@RestController
@RequestMapping("/api/activities")
public class JarActivityController {

    @Autowired
    private JarActivityService jarActivityService;

    @Autowired
    private JarRepository jarRepository;

    @GetMapping("/jar/{jarId}")
    public List<JarActivity> getActivitiesByJar(@PathVariable Long jarId) {
        Jar jar = jarRepository.findById(jarId)
                .orElseThrow(() -> new RuntimeException("Jar not found with ID: " + jarId));
        return jarActivityService.getJarActivities(jar);
    }
}
