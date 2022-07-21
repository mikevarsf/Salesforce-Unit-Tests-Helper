@IsTest
public class UnitTestsHelperCntrlTest {


    @IsTest
    static void validateAccess(){
        Account acc = new Account(Name = 'TestAccount');
        insert acc;
        Test.startTest();
            System.assertEquals(false, UnitTestsHelperCntrl.getRecordData(acc.Id, 'CREATABLE').isEmpty());
            System.assertEquals(false, UnitTestsHelperCntrl.getRecordData(acc.Id, 'UPDATABLE').isEmpty());
            System.assertEquals(false, UnitTestsHelperCntrl.getRecordData(acc.Id, 'READABLE').isEmpty());
        Test.stopTest();
    }

    @isTest
    static void listLabels() {
        String header_title1 =  Label.header_title1;
        String creatable_title =  Label.creatable_title;
        String btn_cancel =  Label.btn_cancel;
        String updatable_title =  Label.updatable_title;
        String readable_title =  Label.readable_title;
        String btn_generate_snippet =  Label.btn_generate_snippet;
        String btn_copy =  Label.btn_copy;
        String btn_back =  Label.btn_back;
        String btn_close =  Label.btn_close;
        String header_title2 =  Label.header_title2;
        String header_selected =  Label.header_selected;
        String btn_select_fields =  Label.btn_select_fields;
        String header_title3 =  Label.header_title3;
        String spinner_loading =  Label.spinner_loading;
        String header_title4 =  Label.header_title4;
        String link_text =  Label.link_text;
        String link_blog =  Label.link_blog;
        String help_adv1 =  Label.help_adv1;
        String help_adv2 =  Label.help_adv2;
        String help_adv3 =  Label.help_adv3;
        String help_adv4 =  Label.help_adv4;
        String help_adv5 =  Label.help_adv5;
        String help_adv6 =  Label.help_adv6;
        String link_text_pre =  Label.link_text_pre;
        String link_text_pre_1 =  Label.link_text_pre_1;
        String link_text_1 =  Label.link_text_1;
        String link_feedback =  Label.link_feedback;

        System.assertNotEquals(null, header_title1);
    }

}