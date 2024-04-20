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
    @Query("SELECT targetId as targetId FROM Subscribe WHERE id = :id")
    List<SubscribeQueryDTO> FindTargetIdsForId(@Param("id") String id);

    @Query("SELECT id as id FROM Subscribe WHERE targetId = :id")
    List<SubscribeQueryDTO> FindIdsForTargetId(@Param("id") String id);

    // 이 유저는 해당 유저를 구독중인지
    @Query("SELECT count(*) FROM Subscribe WHERE id = :owner AND targetId = :target")
    Integer IsUserSubscribe(@Param("owner") String owner, @Param("target") String target);
}
