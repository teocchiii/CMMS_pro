package com.cmms;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class BcryptTest {
    public static void main(String[] args) {
        System.out.println(new BCryptPasswordEncoder().encode("admin123"));
    }
}
