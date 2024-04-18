package com.domi.domitube.Repository;

import com.domi.domitube.DTO.SubscribeQueryDTO;
import com.domi.domitube.Repository.Entity.Subscribe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscribeRepository extends JpaRepository<Subscribe, Object> {
    @Query("SELECT targetId FROM Subscribe WHERE id = :id")
    List<SubscribeQueryDTO> FindTargetIdsForId(@Param("id") String id);
}
