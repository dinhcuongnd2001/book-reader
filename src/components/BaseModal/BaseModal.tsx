import * as React from 'react';
import { CSSTransition } from 'react-transition-group';
import "./BaseModal.scss";
import { Attributes } from 'html-react-parser/lib/attributes-to-props';

export interface BaseModalProps {
    show: boolean;
    size?: "md" | "lg" | "xl" | "xxl";
    centered?: boolean;
    scrollable?: boolean;
    fade?: boolean;
    fullscreen?: string | boolean;
    className?: string;
    backdrop?: string;
    children?: React.ReactNode;
    zIndex?: number;
    onHide: () => void;
}
type ExtendedProps = {
    modalStatus: string;
} & Partial<unknown> & Attributes;
function BaseModal(props: BaseModalProps) {
    //Ref
    const modalRef = React.useRef<HTMLDivElement>(null);
    const backdropRef = React.useRef<HTMLDivElement>(null);
    const backdropAnimationTimeout: { current: NodeJS.Timeout | null; } = React.useRef(null);
    //End ref

    //Memo
    const size = React.useMemo(() => props.size ? `modal-${props.size}` : "", [props.size]);
    const centered = React.useMemo(() => props.centered ? 'modal-dialog-centered' : "", [props.centered]);
    const scrollable = React.useMemo(() => props.scrollable ? 'modal-dialog-scrollable' : "", [props.scrollable]);
    const modalClassName = React.useMemo(() => props.className ? `modal-content ${props.className}` : 'modal-content', [props.className]);
    const fullscreen = React.useMemo(() => {
        if (props.fullscreen) {
            if (props.fullscreen === 'modal-fullscreen') {
                return `${props.fullscreen} p-3`;
            }
            return `${props.fullscreen}`;
        }
        return '';
    }, [props.fullscreen]);

    //End memo

    //Event
    const animateStaticBackdrop = React.useCallback(() => {
        if (backdropAnimationTimeout.current) {
            window.clearTimeout(backdropAnimationTimeout.current);
        }
        modalRef.current?.classList.add('modal-static');
        backdropAnimationTimeout.current = setTimeout(() => {
            modalRef.current?.classList.remove('modal-static');
        }, 100);
    }, []);

    const handleEscape = React.useCallback((e: KeyboardEvent) => {
        if (e.code === "Escape") {
            if (props.backdrop && props.backdrop === 'static') {
                animateStaticBackdrop();
            } else {
                props.onHide();
            }
        }
    }, [props, animateStaticBackdrop]);

    const handleBackdropClick = React.useCallback((e: Event) => {
        if (e.target === modalRef.current) {
            e.stopPropagation();
            if (props.backdrop && props.backdrop === 'static') {
                animateStaticBackdrop();
            } else {
                props.onHide();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.backdrop, animateStaticBackdrop]);

    const _onEntered = () => {
    };

    const _onExited = () => {
    };
    //End event

    //Effect
    React.useEffect(function bindEvents() {
        var savedModal: HTMLDivElement | null = null;
        if (props.show) {
            document.addEventListener('keyup', handleEscape, true);
            modalRef.current?.addEventListener('mousedown', handleBackdropClick, true);
            savedModal = modalRef.current;
        }
        return () => {
            document.removeEventListener('keyup', handleEscape, true);
            if (savedModal) {
                savedModal.removeEventListener('mousedown', handleBackdropClick, true);
            }
        };
    }, [props.show, handleBackdropClick, handleEscape]);
    //End effect
    const renderModal = (state: string) => {
        return (
            <>
                <div className={`modal ${transitionStyles[state]}`} tabIndex={-1} ref={modalRef} style={{ zIndex: props.zIndex ? props.zIndex + 1 : "" }}>
                    <div className={`modal-dialog ${size} ${centered} ${scrollable} ${fullscreen}`}>
                        <div className={`rounded-2 ${modalClassName}`}>
                            {
                                React.isValidElement(props.children)
                                    ? React.cloneElement(props.children, { modalStatus: state } as ExtendedProps)
                                    : props.children
                            }
                        </div>
                    </div>
                </div>
                <div className={`custom-modal-backdrop 11 ${transitionStyles[state]}`} ref={backdropRef} style={{ zIndex: props.zIndex ? `${props.zIndex}` : 1040 }} />
            </>
        );
    };

    const transitionStyles: Record<string, string> = {
        entering: "fade d-block",
        entered: "fade show d-block",
        exiting: "fade d-block",
        exited: "",
        unmounted: ""
    };

    return (props.fade ?
        <CSSTransition
            in={props.show}
            timeout={150}
            unmountOnExit
            nodeRef={modalRef}
            onEntered={_onEntered}
            onExited={_onExited}
        >
            {state => renderModal(state)}
        </CSSTransition> : props.show ? renderModal('entered') : null
    );
}

BaseModal.defaultProps = {
    show: false,
    fade: true,
    centered: false,
    scrollable: false,
    fullscreen: false,
};

export default React.memo(BaseModal);