package com.lecturesystem.reservationsystem.service.impl;

import com.lecturesystem.reservationsystem.model.dto.users.OneTimePassCodeWrapper;
import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import dev.samstevens.totp.util.Utils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
public class TwoFactorAuthenticationService {


    public boolean isOneTimePassValid(String userCode, String newOneTimePassCode) {
        return userCode.equals(newOneTimePassCode);
    }

    public OneTimePassCodeWrapper createOneTimePassword() {
        Random random = new Random();
        int code = random.nextInt(899999) + 100000;
        Date expirationDate = new Date(System.currentTimeMillis() + (1000 * 60 * 2));
        OneTimePassCodeWrapper oneTimePassCodeWrapper = new OneTimePassCodeWrapper();
        oneTimePassCodeWrapper.setCode(code);
        oneTimePassCodeWrapper.setExpirationDate(expirationDate);
        return oneTimePassCodeWrapper;
    }

    public String generateNewSecret() {
        return new DefaultSecretGenerator().generate();
    }

    public String generateQrCodeImageUri(String secret) throws QrGenerationException {
        QrData data = new QrData.Builder()
                .label("FMI DeskSpot Two-Factor Authentication")
                .secret(secret)
                .digits(6)
                .period(60)
                .algorithm(HashingAlgorithm.SHA1)
                .issuer("FMI DeskSpot")
                .build();
        QrGenerator generator = new ZxingPngQrGenerator();
        byte[] imageData;

        imageData = generator.generate(data);

        return Utils.getDataUriForImage(imageData, generator.getImageMimeType());
    }

    public boolean isOtpValid(String secret, String code) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator();
        CodeVerifier codeVerifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        return codeVerifier.isValidCode(secret, code);
    }
}
