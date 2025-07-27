package com.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference; // ADD THIS IMPORT
import com.fasterxml.jackson.annotation.JsonManagedReference; // ADD THIS IMPORT

@Entity
public class Jar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private double targetAmount;

    private double savedAmount = 0.0;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-jars") // CHANGE FROM @JsonIgnore TO THIS
    private User user;

    @OneToMany(mappedBy = "jar", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("jar-deposits") // ADD THIS
    private List<Deposite> deposits;

    // Constructors - SAME AS BEFORE
    public Jar() {}

    public Jar(String title, double targetAmount, User user) {
        this.title = title;
        this.targetAmount = targetAmount;
        this.user = user;
        this.savedAmount = 0.0;
    }

    // Getters and Setters - SAME AS BEFORE
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public double getSavedAmount() {
        return savedAmount;
    }

    public void setSavedAmount(double savedAmount) {
        this.savedAmount = savedAmount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Deposite> getDeposits() {
        return deposits;
    }

    public void setDeposits(List<Deposite> deposits) {
        this.deposits = deposits;
    }
}