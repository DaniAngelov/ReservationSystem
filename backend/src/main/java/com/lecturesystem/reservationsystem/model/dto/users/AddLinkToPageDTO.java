package com.lecturesystem.reservationsystem.model.dto.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AddLinkToPageDTO {
    private String username;
    private List<String> linkToPage;
}
