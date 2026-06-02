package com.dishcover.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {

    private String title;
    private String date;
    private String imageUrl;
    private Integer duration;
    private String description;
    private String eventCategory;
    
}
