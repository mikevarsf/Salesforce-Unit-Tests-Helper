import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getRecordData from '@salesforce/apex/UnitTestsHelperCntrl.getRecordData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//labels
import header_fields from '@salesforce/label/c.header_fields';
import header_title1 from '@salesforce/label/c.header_title1';
import creatable_title from '@salesforce/label/c.creatable_title';
import btn_cancel from '@salesforce/label/c.btn_cancel';
import updatable_title from '@salesforce/label/c.updatable_title';
import readable_title from '@salesforce/label/c.readable_title';
import btn_generate_snippet from '@salesforce/label/c.btn_generate_snippet';
import btn_copy from '@salesforce/label/c.btn_copy';
import btn_back from '@salesforce/label/c.btn_back';
import btn_close from '@salesforce/label/c.btn_close';
import header_title2 from '@salesforce/label/c.header_title2';
import header_selected from '@salesforce/label/c.header_selected';
import btn_select_fields from '@salesforce/label/c.btn_select_fields';
import header_title3 from '@salesforce/label/c.header_title3';
import spinner_loading from '@salesforce/label/c.spinner_loading';
import header_title4 from '@salesforce/label/c.header_title4';
import link_text from '@salesforce/label/c.link_text';
import link_text_1 from '@salesforce/label/c.link_text_1';
import link_blog from '@salesforce/label/c.link_blog';
import help_adv1 from '@salesforce/label/c.help_adv1';
import help_adv2 from '@salesforce/label/c.help_adv2';
import help_adv3 from '@salesforce/label/c.help_adv3';
import help_adv4 from '@salesforce/label/c.help_adv4';
import help_adv5 from '@salesforce/label/c.help_adv5';
import help_adv6 from '@salesforce/label/c.help_adv6';
import link_text_pre from '@salesforce/label/c.link_text_pre';
import link_text_pre_1 from '@salesforce/label/c.link_text_pre_1';
import link_feedback from '@salesforce/label/c.link_feedback';


const columns = [
    { label: 'Label', fieldName: 'label' },
    { label: 'API Name', fieldName: 'apiName' },
    { label: 'Value', fieldName: 'value'},
];

export default class UnitTestsHelper extends LightningElement {

    @api recordId;
    @api objectApiName;
    showFieldsPopup;
    showOutputSnippetPopup;
    showHelpPopup;
    showSpinner;
    snippetOutput;
    @track data;
    data = [];
    columns = columns;
    @track objectInfo;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo;

    showCreatableFields = false;
    showUpdatableFields = false;
    showReadableFields = false;


    label = {
        header_fields,
        header_title1,
        creatable_title,
        btn_cancel,
        updatable_title,
        readable_title,
        btn_generate_snippet,
        btn_copy,
        btn_back,
        btn_close,
        header_title2,
        header_selected,
        btn_select_fields,
        header_title3,
        spinner_loading,
        header_title4,
        link_text,
        link_text_1,
        link_blog,
        help_adv1,
        help_adv2,
        help_adv3,
        help_adv4,
        help_adv5,
        help_adv6,
        link_text_pre,
        link_text_pre_1,
        link_feedback
    };

    handleActionsChange(e){
        const selectedOption = e.detail.value;
        this.snippetOutput = this.snippetOutput.replace(this.value, selectedOption);
        this.value = selectedOption;
    }

    handleSelectFields(){
        this.showFieldsPopup = true;
        this.showSpinner = true;
    }

    handleCloseSelectFieldsModal(){
        this.showFieldsPopup = false;
    }

    handleCloseOutputSnippetPopup(){
        this.showOutputSnippetPopup = false;
        this.showFieldsPopup = true;
    }

    handleCloseAll() {
        this.showOutputSnippetPopup = false;
        this.showFieldsPopup = false;
        this.showHelpPopup = false;
    }

    handleCloseHelpPopup() {
        this.showOutputSnippetPopup = true;
        this.showHelpPopup = false;
    }

    handleShowHelpPopup() {
        this.showHelpPopup = true;
        this.showOutputSnippetPopup = false;
    }

    handleGenerateTestRecordSnippet(){
        this.showFieldsPopup = false;
        this.showOutputSnippetPopup = true;

        try {
            let variableName = this.objectApiName.toLowerCase();
            let result = this.objectApiName + ' ' + variableName + ' = new ' + this.objectApiName + "();";
            let selectedFields = this.template.querySelector('lightning-datatable').getSelectedRows();

            for (let i = 0; i < selectedFields.length; i++){
                result += '\n';
                if (selectedFields[i].displayType == 'BOOLEAN' ){
                    result += variableName + '.' + selectedFields[i].apiName + ' = ' + selectedFields[i].value + ';';
                } else {
                    result += variableName + '.' + selectedFields[i].apiName + ' = \'' + selectedFields[i].value + '\';';
                }
            }

            result += '\n';
            let dmlAction = '';
            if (this.showCreatableFields) dmlAction = 'insert ';
            if (this.showUpdatableFields) dmlAction = 'update ';
            if (this.showCreatableFields || this.showUpdatableFields) result += dmlAction + variableName + ';';

            this.snippetOutput = result;
        } catch (e){
            this.showNotification('Error',JSON.stringify(e), 'error');
        }

    }

    hideAllTables() {
        this.showReadableFields = false;
        this.showCreatableFields = false;
        this.showUpdatableFields = false;
    }

    displaySelectedTable(accessTypeStr){
        switch (accessTypeStr) {
          case 'CREATABLE':
            this.showCreatableFields = true;
            break;
          case 'UPDATABLE':
            this.showUpdatableFields = true;
            break;
          case 'READABLE':
            this.showReadableFields = true;
            break;
          default:
        }
    }

    handleTabChange(event){
        this.hideAllTables();
        this.displaySelectedTable(event.target.value);

        this.showSpinner = true;
        getRecordData({recordID: this.recordId, accessTypeStr :  event.target.value})
            .then(result => {
                this.data = result;
                this.showSpinner = false;
            })
            .catch(error => {
                this.showNotification('Error',JSON.stringify(error), 'error');
                this.showSpinner = false;
            });
    }

    copyTo() {
        try {
            let extension_link = this.snippetOutput;
            var dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = extension_link;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
            this.showNotification('Success!', 'Copied to Clipboard', 'success');
        } catch (e){
            this.showNotification('Error',JSON.stringify(e), 'error');
        }
    }

    showNotification(title, msg, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: msg,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

}