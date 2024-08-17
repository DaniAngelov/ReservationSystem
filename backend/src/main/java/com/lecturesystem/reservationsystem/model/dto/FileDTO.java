package com.lecturesystem.reservationsystem.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
public class FileDTO implements Serializable {
    private MultipartFile file;
}
