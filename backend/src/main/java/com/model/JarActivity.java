package com.model;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference; // ADD THIS IMPORT

@Entity
public class JarActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action; // e.g. "Created Jar", "Added ₹500 to Jar"

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "jar_id")
    @JsonBackReference("jar-activities") // ADD THIS
    private Jar jar;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-activities") // ADD THIS
    private User user;

    // Getters and setters - SAME AS BEFORE
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Jar getJar() { return jar; }
    public void setJar(Jar jar) { this.jar = jar; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}