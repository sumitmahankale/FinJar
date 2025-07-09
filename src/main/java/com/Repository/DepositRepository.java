package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Deposite;

public interface DepositRepository extends JpaRepository<Deposite, Long>{
    List<Deposite> findByJarId(Long jarId); //Specific jar

}
