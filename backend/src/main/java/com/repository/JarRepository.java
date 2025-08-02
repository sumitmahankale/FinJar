package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Jar;

public interface JarRepository extends JpaRepository<Jar, Long>{
	List<Jar> findByUserId(Long userId);

}
