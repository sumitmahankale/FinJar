package com.repo;

import com.model.DepositEntity;
import com.model.JarEntity;
import com.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepositRepo extends JpaRepository<DepositEntity, Long> {
    List<DepositEntity> findByUser(UserEntity user);
    List<DepositEntity> findByJarAndUser(JarEntity jar, UserEntity user);
}
