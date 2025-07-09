package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Jar;
import com.model.JarActivity;

public interface JarActivityRepository extends JpaRepository<JarActivity, Long> {
	 List<JarActivity> findByJarOrderByTimestampDesc(Jar jar);
}

