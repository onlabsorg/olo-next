'use babel';

import { CompositeDisposable } from 'atom';

export default {

    subscriptions: null,

    activate(state) {

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-text-editor', {
            'olo-atom:insert-expression': () => this.insertExpression()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.oloAtomView.destroy();
    },

    serialize() {
        return {
            oloAtomViewState: this.oloAtomView.serialize()
        };
    },

    insertExpression () {
        let editor = atom.workspace.getActiveTextEditor();
        if (editor) {  
            editor.insertText('<%  %>');
            let cursor = editor.getCursorBufferPosition();
            editor.setCursorBufferPosition([cursor.row, cursor.column-3]);
        }
    }
};
