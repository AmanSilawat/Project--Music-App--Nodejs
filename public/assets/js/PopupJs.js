class PopupJs {
    constructor(container, header, body, eventHandler) {
        this.containerElement = container;
        this.headerElement = header;
        this.bodyElement = body;
        this.eventHandler = eventHandler;
    }

    set header(header) {
        this.headerElement = header;
    }

    set body(body) {
        this.bodyElement = body;
    }

    get header() {
        return this.headerElement;
    }

    get body() {
        return this.bodyElement;
    }

    visible() {
        this.containerElement.classList.remove('closed');
        this.listener();    
    }

    listener() {
        this.containerElement.addEventListener('click', this.eventHandler.bind(this));
    }
}

export default PopupJs;