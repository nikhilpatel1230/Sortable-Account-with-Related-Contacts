public class AccountContactController {
    
        @AuraEnabled(cacheable=true)
        public static List<AccountWithContactCount> getAccountsWithContactCount() {
            List<AggregateResult> results = [
                SELECT AccountId, COUNT(Id) contactCount
                FROM Contact
                GROUP BY AccountId
            ];
    
            Map<Id, Integer> contactCountMap = new Map<Id, Integer>();
            for (AggregateResult ar : results) {
                contactCountMap.put((Id)ar.get('AccountId'), (Integer)ar.get('contactCount'));
            }
    
            List<AccountWithContactCount> accountsWithCounts = new List<AccountWithContactCount>();
            for (Account acc : [
                SELECT Id, Name, Phone, Website  FROM Account WHERE Id IN :contactCountMap.keySet()
            ]) {
                accountsWithCounts.add(new AccountWithContactCount(acc.Id, acc.Name, contactCountMap.get(acc.Id),acc.Phone, acc.Website));
            }
    
            return accountsWithCounts;
        }
    
        public class AccountWithContactCount {
            @AuraEnabled public Id accountId;
            @AuraEnabled public String accountName;
            @AuraEnabled public Integer contactCount;
            @AuraEnabled public String phone;
            @AuraEnabled public String website;
    
            public AccountWithContactCount(Id accountId, String accountName, Integer contactCount,String phone, String website) {
                this.accountId = accountId;
                this.accountName = accountName;
                this.contactCount = contactCount;
                this.phone = phone;
                this.website = website;

        }
    }
}
    
