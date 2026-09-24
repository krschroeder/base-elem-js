import $be, { type AppendMethod } from "../base-elem-js";


const { make: el, useCssAnimate } = $be;

interface DialogConfig {
    animateDur: number;
    appendTo: HTMLElement;
    useWrap: boolean;
    appendMethod: AppendMethod;
    removeWithClose?: boolean;
}

const defaultDialogConfig: DialogConfig = {
    animateDur: 600,
    appendTo: document.body,
    useWrap: true,
    appendMethod: 'append',
    removeWithClose: false
}

const dialog = (
    className: string, 
    html: HTMLElement | HTMLElement[] | string, 
    config: Partial<DialogConfig> = {}
) => {

    const 
        opts            = {...defaultDialogConfig, ...config},
        dialogEl        = el(`dialog.dialog ${className}`),
        dialogWrap      = el(`div.dialog-wrap dialog-wrap--${className}`),
        dialogElInner   = el('div.dialog__inner'),
        [ cssAnimate ]  = useCssAnimate([opts.appendTo, dialogEl, dialogWrap], 'dialog-'),
        btnClose        = el('button', {
            className: 'dialog__btn-close', 
            ariaLabel: 'Close'
        }),
        $dialog         = $be(dialogEl),
        $dialogInner    = $be(dialogElInner),
        $btnClose       = $be(btnClose),
        dialogAppendEl  = opts.useWrap ? dialogWrap : dialogEl
    ;

    if (opts.useWrap) {
        dialogWrap.append(dialogEl);
    }

    $dialogInner.insert(btnClose).insert(html);
    $dialog
        .addClass(className)
        .css({'--dialog-tg-dur': opts.animateDur + 'ms'})
        .insert(dialogElInner)
    ;

    const closeEvt = () => {
        cssAnimate(false,opts.animateDur,() => {
            dialogEl.close();
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
        if (ev.target === dialogEl) {
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

    return {
        $dialog,
        $dialogInner,
        dialogEl,
        closeEvt,
        showModal: (cb?: () => void) => {
            
            dialogEl.showModal();
            cssAnimate(true, opts.animateDur);
           
            if (cb && typeof cb === 'function') cb();
        },
        show: (cb?: () => void) => {
            dialogEl.show();
            cssAnimate(true, opts.animateDur);
            if (cb && typeof cb === 'function') cb();
        }
    }
}

export default dialog;