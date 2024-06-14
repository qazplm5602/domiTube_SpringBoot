package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Object> {
    List<User> findByNameContains(String name, Pageable pageable);
}
