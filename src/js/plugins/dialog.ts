import type { AppendMethod, InsertElem } from "../types";
import $be  from "../base-elem-js";

type DialgShowType = 'show' | 'showModal';
interface DialogConfig {
    className?: string | null;
    animateDur: number;
    appendTo: HTMLElement;
    useWrap: boolean;
    appendMethod: AppendMethod;
    removeWithClose?: boolean;
    closeBtnLabel: string;
}

const { make: el, useCssAnimate } = $be;

const defaultDialogConfig: DialogConfig = {
    animateDur: 600,
    appendMethod: 'append',
    appendTo: document.body,
    className: null,
    closeBtnLabel: 'Close',
    removeWithClose: false,
    useWrap: true,
}

const dialog = (
    html: InsertElem, 
    config: Partial<DialogConfig> = {}
) => {

    const 
        opts            = {...defaultDialogConfig, ...config},
        dialog          = el(`dialog.dialog${opts.className ? ' ' + opts.className : ''}`),
        dialogWrap      = el(`div.dialog-wrap${opts.className ? ' dialog-wrap--' + opts.className : ''}`),
        dialogContent   = el('div.dialog__content'),
        [ cssAnimate ]  = useCssAnimate([opts.appendTo, dialog, dialogWrap], 'dialog-'),
        btnClose        = el('button', {
            className: 'dialog__btn-close', 
            ariaLabel: opts.closeBtnLabel
        }),
        $dialog         = $be(dialog),
        $dialogContent  = $be(dialogContent),
        $btnClose       = $be(btnClose),
        dialogAppendEl  = opts.useWrap ? dialogWrap : dialog
    ;

    if (opts.useWrap) {
        dialogWrap.append(dialog);
    }

    $dialogContent.insert(btnClose).insert(html);
    $dialog
        .addClass(opts.className)
        .css({'--dialog-dur': opts.animateDur + 'ms'})
        .insert(dialogContent)
    ;

    const closeEvt = () => {
        cssAnimate(false,opts.animateDur,() => {
            dialog.close();
            if (opts.removeWithClose) {
                dialogAppendEl.remove();
            }
        })
    }

    // Append to DOM
    $be(opts.appendTo).insert(dialogAppendEl, opts.appendMethod);
    
    // Event handlers
    $btnClose.on('click.dialog', closeEvt);
    $dialog.on('click', (ev: MouseEvent) => {
        if (ev.target === dialog) {
            // if its the same element, its an outside click so close
            // yes that is how it works, which is why we have an 'inner' div
            closeEvt();
        }
    }).on('keydown', (ev: KeyboardEvent) => {

        if (ev.key === 'Escape') {
            ev.preventDefault();   
            closeEvt();
        }
    });

    const openCore = (openType: DialgShowType = 'show', cb?: () => void) => {
        if (openType === 'showModal') {
            dialog.showModal();
        } else {
            dialog.show();
        }
        cssAnimate(true, opts.animateDur);
        if (cb && typeof cb === 'function') cb();
    }

    return {
        $dialog,
        $dialogContent,
        dialog,
        closeEvt,
        showModal: (cb?: () => void) => {
            openCore('showModal',cb)
        },
        show: (cb?: () => void) => {
            openCore('show', cb);
        }
    }
}

export default dialog;