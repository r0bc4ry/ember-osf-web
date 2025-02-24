// BEGIN-SNIPPET validate-list.component
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { ValidatorResult } from 'ember-changeset-validations';
import { ChangesetDef } from 'ember-changeset/types';

import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { transposeResults } from 'ember-osf-web/validators/list';

import { validation } from './validation';

export default class ValidateListDemo extends Component {
    changeset!: ChangesetDef & DemoObject;

    @computed('changeset.error.list.validation')
    get listResults() {
        return transposeResults(
            this.changeset.error.list.validation as ValidatorResult[],
        );
    }

    init() {
        super.init();
        this.set(
            'changeset',
            buildChangeset({ list: ['foo', 'bar', 'baz'] }, validation),
        );
    }
}
// END-SNIPPET

export interface DemoObject {
    list: string[];
}
