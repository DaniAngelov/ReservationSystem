package com.lecturesystem.reservationsystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class FeedbackFormDTO {
    private String username;
    private Integer lectureRating;
    private Integer lectorRating;
    private String description;
    private boolean isAnonymous;
    private String name;
}
