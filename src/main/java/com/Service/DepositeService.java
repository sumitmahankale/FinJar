package com.service;

import java.util.List;

import com.model.Deposite;

public interface DepositeService {
	    List<Deposite> getDepositsForJar(Long jarId);
	    void deleteDeposit(Long depositId);
		Deposite addDepositToJar(Long jarId, Deposite deposit, Long userId);
		
}
