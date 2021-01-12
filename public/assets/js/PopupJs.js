class PopupJs {
    constructor(container, header, body, queueReference) {
        this.containerElement = container;
        this.headerElement = header;
        this.bodyElement = body;
        this.queueReference = queueReference;

        // Each time you call this.clicked.bind(this), it returns a new and different function.
        this.clickHandler = this.queueReference.popupEventHandler.bind(this);
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
        this.containerElement.addEventListener('click', this.clickHandler);
    }

}

export default PopupJs;