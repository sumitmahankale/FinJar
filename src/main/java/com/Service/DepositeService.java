package com.Service;

import java.util.List;

import com.Model.Deposite;

public interface DepositeService {
	 Deposite addDepositToJar(Long jarId, Deposite deposit);
	    List<Deposite> getDepositsForJar(Long jarId);
	    void deleteDeposit(Long depositId);
}
