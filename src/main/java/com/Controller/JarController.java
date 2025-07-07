package com.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Model.Jar;
import com.Service.JarService;

@RestController
@RequestMapping("/api/jars")
public class JarController {

    @Autowired
    private JarService jarService;

    @PostMapping
    public Jar createJar(@RequestBody Jar jar) {
        return jarService.createJar(jar);
    }

    @GetMapping("/user/{userId}")
    public List<Jar> getJarsByUser(@PathVariable Long userId) {
        return jarService.getJarsByUserId(userId);
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

