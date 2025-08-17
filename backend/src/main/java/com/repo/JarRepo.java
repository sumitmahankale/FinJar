package com.repo;

import com.model.JarEntity;
import com.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JarRepo extends JpaRepository<JarEntity, Long> {
    List<JarEntity> findByUser(UserEntity user);
}
