package com.model;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "deposits", indexes = @Index(name = "idx_dep_jar", columnList = "jar_id"))
public class DepositEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private JarEntity jar;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private UserEntity user;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 300)
    private String description;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public JarEntity getJar() { return jar; }
    public void setJar(JarEntity jar) { this.jar = jar; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
}
