package com.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model.Jar;
import com.model.User;
import com.repository.DepositRepository;
import com.repository.JarRepository;
import com.repository.UserRepository;
import com.repository.JarActivityRepository;
import com.util.JwtUtil;

@Service
public class JarServiceIMPL implements JarService {

    @Autowired
    private JarRepository jarRepository;

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JarActivityRepository jarActivityRepository;

    @Override
    public Jar createJarFromToken(Jar jar, String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            jar.setUser(user);
            jar.setSavedAmount(0.0);
            
            return jarRepository.save(jar);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create jar: " + e.getMessage());
        }
    }

    @Override
    public Jar createJar(Jar jar, Long userId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            jar.setUser(user);
            jar.setSavedAmount(0.0);
            
            return jarRepository.save(jar);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create jar: " + e.getMessage());
        }
    }

    @Override
    public List<Jar> getJarsByToken(String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            return jarRepository.findByUserId(user.getId());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch jars: " + e.getMessage());
        }
    }

    @Override
    public List<Jar> getJarsByUserId(Long userId) {
        try {
            return jarRepository.findByUserId(userId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch jars for user: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Jar updateJar(Long jarId, Jar updatedJar) {
        try {
            Optional<Jar> optionalJar = jarRepository.findById(jarId);
            if (!optionalJar.isPresent()) {
                throw new RuntimeException("Jar not found with id: " + jarId);
            }

            Jar existingJar = optionalJar.get();
            existingJar.setTitle(updatedJar.getTitle());
            existingJar.setTargetAmount(updatedJar.getTargetAmount());
            
            return jarRepository.save(existingJar);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update jar: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteJar(Long jarId) {
        try {
            // First verify the jar exists
            Optional<Jar> optionalJar = jarRepository.findById(jarId);
            if (!optionalJar.isPresent()) {
                throw new RuntimeException("Jar not found with id: " + jarId);
            }

            Jar jar = optionalJar.get();
            System.out.println("Starting deletion process for jar ID: " + jarId + " (" + jar.getTitle() + ")");
            
            // Step 1: Delete all JarActivity records for this jar
            try {
                System.out.println("Deleting jar activities...");
                List<com.model.JarActivity> activities = jarActivityRepository.findByJarOrderByTimestampDesc(jar);
                System.out.println("Found " + activities.size() + " activities to delete");
                
                for (com.model.JarActivity activity : activities) {
                    jarActivityRepository.deleteById(activity.getId());
                    System.out.println("Deleted activity ID: " + activity.getId());
                }
                
                // Alternative: Use bulk delete if available
                // jarActivityRepository.deleteByJar(jar);
                
                System.out.println("All jar activities deleted");
                
            } catch (Exception e) {
                System.err.println("Failed to delete jar activities: " + e.getMessage());
                // Continue anyway - might not be critical
            }
            
            // Step 2: Delete all deposits for this jar
            try {
                System.out.println("Deleting deposits...");
                List<com.model.Deposite> deposits = depositRepository.findByJarId(jarId);
                System.out.println("Found " + deposits.size() + " deposits to delete");
                
                for (com.model.Deposite deposit : deposits) {
                    depositRepository.deleteById(deposit.getId());
                    System.out.println("Deleted deposit ID: " + deposit.getId());
                }
                
                System.out.println("All deposits deleted");
                
            } catch (Exception e) {
                System.err.println("Failed to delete deposits: " + e.getMessage());
                
                // Fallback: Try bulk delete
                try {
                    depositRepository.deleteByJarId(jarId);
                    System.out.println("Deposits deleted using bulk method as fallback");
                } catch (Exception bulkError) {
                    System.err.println("Bulk delete also failed: " + bulkError.getMessage());
                    throw new RuntimeException("Failed to delete deposits: " + bulkError.getMessage());
                }
            }

            // Step 3: Clear jar's relationships and prepare for deletion
            jar.setSavedAmount(0.0);
            
            // Clear any collections to break references
            if (jar.getDeposits() != null) {
                jar.getDeposits().clear();
            }
            
            // Save the cleared jar
            jarRepository.save(jar);
            
            // Step 4: Now delete the jar itself
            System.out.println("Now deleting the jar...");
            jarRepository.deleteById(jarId);
            
            System.out.println("Successfully deleted jar with ID: " + jarId);
            
        } catch (Exception e) {
            System.err.println("Error deleting jar with ID " + jarId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete jar: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Jar> getJarById(Long jarId) {
        try {
            return jarRepository.findById(jarId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch jar by id: " + e.getMessage());
        }
    }
}