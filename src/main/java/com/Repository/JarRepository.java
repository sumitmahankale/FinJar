package com.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Model.Jar;

public interface JarRepository extends JpaRepository<Jar, Long>{
	List<Jar> findByUserId(Long userId);

}
