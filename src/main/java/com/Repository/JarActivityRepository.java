package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.model.Jar;
import com.model.JarActivity;

public interface JarActivityRepository extends JpaRepository<JarActivity, Long> {
    
    // Existing method
    List<JarActivity> findByJarOrderByTimestampDesc(Jar jar);
    
    // Add bulk delete method for jar deletion
    @Modifying
    @Transactional
    @Query("DELETE FROM JarActivity ja WHERE ja.jar.id = :jarId")
    void deleteByJarId(@Param("jarId") Long jarId);
    
    // Alternative method using Jar entity
    @Modifying
    @Transactional
    void deleteByJar(Jar jar);
}