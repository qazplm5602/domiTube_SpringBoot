package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.Subscribe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscribeRepository extends JpaRepository<Subscribe, Object> {
}
