package com.trading_212.crypto_sim.exeption;

public class NotFoundException extends RuntimeException{
    public NotFoundException(String message)
    {
        super(message);
    }

}
