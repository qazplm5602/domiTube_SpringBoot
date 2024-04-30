package com.domi.domitube.Service;

import com.domi.domitube.DTO.SubscribeQueryDTO;
import com.domi.domitube.Repository.Entity.Subscribe;
import com.domi.domitube.Repository.SubscribeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscribeService {
    final SubscribeRepository subscribeRepository;

    public List<SubscribeQueryDTO> GetSubscribeUsers(String id) {
        return subscribeRepository.FindTargetIdsForId(id);
    }

    // 유저를 구독한 사람들 불러옴
    public List<SubscribeQueryDTO> GetSubscribers(String id) {
        return subscribeRepository.FindIdsForTargetId(id);
    }

    public Boolean HasSubscribeUser(String id, String target) {
        return subscribeRepository.IsUserSubscribe(id, target) == 1;
    }

    public void SetSubscribe(String id, String target, Boolean active) {
        Subscribe entity = Subscribe.builder().id(id).targetId(target).build();
        if (active) {
            subscribeRepository.save(entity);
        } else {
            subscribeRepository.delete(entity);
        }
    }
}
