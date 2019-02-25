import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import User from 'ember-osf-web/models/user';
import UserPassword from 'ember-osf-web/models/user-password';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class ChangePasswordPane extends Component.extend({
    submitTask: task(function *(this: ChangePasswordPane) {
        const errorMessage = this.i18n.t('settings.account.changePassword.updateFail');
        const { validations } = yield this.userPassword.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        try {
            yield this.userPassword.save();
        } catch (e) {
            return this.toast.error(errorMessage);
        }

        this.set('hasSubmitted', true);
    }),
}) {
    // Private parameters
    userPassword!: UserPassword;
    hasSubmitted: boolean = false;
    didValidate = false;

    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service passwordStrength!: PasswordStrength;
    @service toast!: Toast;
    @service store!: DS.Store;
    @alias('currentUser.user') user!: User;

    init() {
        this.set('userPassword', this.store.createRecord('user-password'));
        return super.init();
    }

    @action
    submit() {
        this.submitTask.perform();
    }

    @action
    updateError() {
        const errorMessage = this.i18n.t('settings.account.changePassword.incorrectPassword');
        return this.toast.error(errorMessage);
    }
}
