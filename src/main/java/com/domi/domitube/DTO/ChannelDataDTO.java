package com.domi.domitube.DTO;

public class ChannelDataDTO extends UserDataDTO {
    public Boolean banner;
    public Integer follower;
    public Boolean subscribe;

    public static ChannelDataDTO ConvertUserData(UserDataDTO data) {
        ChannelDataDTO response = new ChannelDataDTO();
        response.id = data.id;
        response.name = data.name;
        response.icon = data.icon;

        return response;
    }

}
