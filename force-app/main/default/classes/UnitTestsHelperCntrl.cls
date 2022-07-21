public with sharing class UnitTestsHelperCntrl {

    private static AccessType getAccessType(String accessTypeStr){
        switch on accessTypeStr {
            when 'CREATABLE' {
                return AccessType.CREATABLE;
            }
            when 'UPDATABLE' {
                return AccessType.UPDATABLE;
            }
            when 'READABLE' {
                return AccessType.READABLE;
            }
            when else {		  
                return null;
            }
        }
    }

    @AuraEnabled
    public static List<RecordData> getRecordData(Id recordID, String accessTypeStr){
        DescribeSObjectResult describeResult = Id.valueof(recordID).getSObjectType().getDescribe();
        Set<String> fieldNames = new Set<String>();
        fieldNames.addAll(describeResult.fields.getMap().keySet());

        String query =' SELECT ' +String.join( new List<String>(fieldNames), ',' ) +' FROM ' +describeResult.getName() +' WHERE ' +' id = :recordId ' +' LIMIT 1 ';

        AccessType accessType = getAccessType(accessTypeStr);

        SObjectAccessDecision securityDecision = Security.stripInaccessible(accessType, Database.query(String.escapeSingleQuotes(query)));
        Set<String> removedFields = new Set<String>();

        SObjectType sObjType = Id.valueof(recordID).getSObjectType();

        if (!securityDecision.getRemovedFields().isEmpty())
            removedFields.addAll(securityDecision.getRemovedFields().get(String.valueOf(sObjType)));
        // put all fields to the lowercase:
        Set<String> newRemovedFields = new Set<String>();
        for (String rf : removedFields){
            rf = rf.toLowerCase();
            newRemovedFields.add(rf.toLowerCase());
        }

        fieldNames.removeAll(newRemovedFields);

        // do not use an ID field for updates
        if (accessTypeStr == 'UPDATABLE' || accessTypeStr == 'CREATABLE') fieldNames.remove('id');

        List<SObject> records = securityDecision.getRecords();
        List<RecordData> recordData = new List<RecordData>();

        for (String fieldName : fieldNames){
            RecordData rd = new RecordData();
            rd.apiName = String.valueOf(describeResult.fields.getMap().get(fieldName));
            rd.label =  String.valueOf(describeResult.fields.getMap().get(fieldName).getDescribe().getLabel());

            if (records[0].get(fieldName) != null){
                Schema.SObjectField field = describeResult.fields.getMap().get(fieldName);
                Schema.DisplayType fieldType = field.getDescribe().getType();
                rd.displayType = String.valueOf(fieldType);
                if (String.valueOf(fieldType) != 'DATETIME'){
                    rd.value = String.valueOf(records[0].get(fieldName));
                } else {
                    rd.value = records[0].get(fieldName);
                }
                recordData.add(rd);
            }
        }

        return recordData;
    }

    public class RecordData {
        @AuraEnabled
        public String apiName { get; set; }
        @AuraEnabled
        public String label { get; set; }
        @AuraEnabled
        public String displayType { get; set; }
        @AuraEnabled
        public Object value { get; set; }
    }

}