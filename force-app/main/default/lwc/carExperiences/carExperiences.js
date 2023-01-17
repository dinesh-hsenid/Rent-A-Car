import { LightningElement, api } from 'lwc';
import getExperiences from '@salesforce/apex/carExperienceController.getExperiences';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CarExperiences extends NavigationMixin(LightningElement) {

    privateCarId;

    @api
    get carId() {
        return this.privateCarId;
    }

    set carId(value) {
        this.privateCarId = value;
        this.getCarExperiences();
    }

    carExperiences = [];

    connectedCallback() {
        this.getCarExperiences();
    }

    @api
    getCarExperiences() {  // Imperative call, because we are not going to fetch the experiences details from browser cache.
        getExperiences({carId : this.privateCarId}).then( experiences => {
            this.carExperiences = experiences;
        }).catch(error => {
            this.showToast('ERROR', error.body.message, 'error');
        }); 
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant
        });

        this.dispatchEvent(toastEvent);
    }

    userClickHandler(event) {
        const userId = event.target.getAttribute('data-userid');

        this[NavigationMixin.Navigate] ({
            type : "standard__recordPage",

            attributes : {
                recordId : userId,
                objectApiName : "User",
                actionName : "view"
            }
        });
    }

    get hasExperiences() {
        if(this.carExperiences.length > 0) {
            return true;
        }
        return false;
    }
}