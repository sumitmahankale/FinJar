package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.model.Deposite;

public interface DepositRepository extends JpaRepository<Deposite, Long> {
    
    // Existing method
    List<Deposite> findByJarId(Long jarId);
    
    // Bulk delete using native SQL (more reliable)
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM deposite WHERE jar_id = :jarId", nativeQuery = true)
    void deleteByJarId(@Param("jarId") Long jarId);
}