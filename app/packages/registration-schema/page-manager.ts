import { computed } from '@ember-decorators/object';
import { assert } from '@ember/debug';
import EmberObject from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { ChangesetDef } from 'ember-changeset/types';
import {
    buildValidation,
    getSchemaBlockGroups,
    SchemaBlock,
    SchemaBlockGroup,
} from 'ember-osf-web/packages/registration-schema';
import { RegistrationResponse } from 'ember-osf-web/packages/registration-schema/registration-response';

export class PageManager extends EmberObject {
    changeset?: ChangesetDef;
    schemaBlockGroups?: SchemaBlockGroup[];
    pageHeadingText?: string;
    isVisited?: boolean;

    constructor(pageSchemaBlocks: SchemaBlock[], registrationResponses: RegistrationResponse) {
        super();
        this.schemaBlockGroups = getSchemaBlockGroups(pageSchemaBlocks);
        if (this.schemaBlockGroups) {
            this.pageHeadingText = this.schemaBlockGroups[0].labelBlock!.displayText!;
            this.isVisited = false;

            this.isVisited = this.schemaBlockGroups.some(
                ({ registrationResponseKey: key }) => Boolean(key && (key in registrationResponses)),
            );

            const validations = buildValidation(this.schemaBlockGroups);
            this.changeset = new Changeset(
                registrationResponses,
                lookupValidator(validations),
                validations,
            ) as ChangesetDef;

            if (Object.values(registrationResponses).length) {
                this.changeset.validate();
            }
        } else {
            assert('PageManager: schemaBlockGroups is not defined.');
        }
    }

    @computed('changeset.isValid')
    get pageIsValid() {
        if (this.changeset) {
            return this.changeset.get('isValid');
        }
        return false;
    }

    setPageIsVisited() {
        this.set('isVisited', true);
    }

    getPageIsVisited() {
        return this.isVisited;
    }

    validatePage() {
        if (this.changeset) {
            this.changeset.validate();
        }
    }
}
