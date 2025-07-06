package com.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Model.Deposit;

public interface DepositRepository extends JpaRepository<Deposit, Long>{

}
