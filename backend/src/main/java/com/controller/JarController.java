package com.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.Jar;
import com.service.JarService;

@RestController
@RequestMapping("/api/jars")
@CrossOrigin(origins = "http://localhost:5173")
public class JarController {

    @Autowired	
    private JarService jarService;

   
    @PostMapping
    public Jar createJar(@RequestBody Jar jar, @RequestHeader("Authorization") String authHeader) {
        return jarService.createJarFromToken(jar, authHeader);
    }

    
    @GetMapping
    public List<Jar> getMyJars(@RequestHeader("Authorization") String authHeader) {
        return jarService.getJarsByToken(authHeader);
    }

   
    @PutMapping("/{id}")
    public Jar updateJar(@PathVariable Long id, @RequestBody Jar jar) {
        return jarService.updateJar(id, jar);
    }

    @DeleteMapping("/{id}")
    public String deleteJar(@PathVariable Long id) {
        jarService.deleteJar(id);
        return "Jar deleted successfully";
    }
}
