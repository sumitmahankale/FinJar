package com.Model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Deposite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "jar_id")
    private Jar jar;

    public Deposite() {}

    public Deposite(double amount, LocalDateTime timestamp, Jar jar) {
        this.amount = amount;
        this.timestamp = timestamp;
        this.jar = jar;
    }

    // Getters and Setters

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
