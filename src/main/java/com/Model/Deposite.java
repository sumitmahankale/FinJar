package com.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference; // ADD THIS IMPORT

@Entity
public class Deposite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "jar_id")
    @JsonBackReference("jar-deposits") // ADD THIS
    private Jar jar;

    public Deposite() {}

    public Deposite(double amount, LocalDateTime timestamp, Jar jar) {
        this.amount = amount;
        this.timestamp = timestamp;
        this.jar = jar;
    }

    // Getters and Setters - SAME AS BEFORE
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Jar getJar() {
        return jar;
    }

    public void setJar(Jar jar) {
        this.jar = jar;
    }
}