class PopupJs {
    constructor({ id = null, headingTxt = null, body = null, footer = null } = {}) {
        this.id = id;
        this.headingTxt = headingTxt;
        this.body = body;
        this.footer = footer;
        this.popupEl = null;
        this.pop();
    }

    pop() {
        let popupNodes = this.getPopup(this.id, this.headingTxt, this.body, this.footer);
        
        // event Listener
        this.eventListener(popupNodes, this.id);

        // append in body
        document.body.prepend(popupNodes.popup);
        this.popupEl = popupNodes.popup;
    }

    // Add Event listener
    eventListener() {
        document.body.addEventListener('click', (event) => this.eventHandler(event), true)
    }

    // handle Event listener
    eventHandler(e) {

        // close popup on blank area and close button
        if (e.target.classList.contains('popup') == true || e.target.classList.contains('closePopup') == true) {
            console.log(true);
            this.closePopup();
        }

        // open popup
        if (e.target.dataset.popup == this.popupEl.id) {
            this.opened();
        }
    }

    opened(e) {
        this.popupEl.classList.remove('closed')
        document.body.classList.add('activePopup');
    }

    closePopup() {
        this.popupEl.classList.add('closed');
        document.body.classList.remove('activePopup');
    }

    getPopup() {
        // default nodes
        let ndConfig = {};
        ndConfig.popup = { el: 'div', cls: 'popup closed' };
        ndConfig.popupLayer = { el: 'div', cls: 'popupLayer' };
        ndConfig.innerPopup = { el: 'div', cls: 'innerPopup' };
        ndConfig.popupHeader = { el: 'div', cls: 'popupHeader' };
        ndConfig.heading = { el: 'div', cls: 'heading', elTxt: "Heading" };
        ndConfig.closePopup = { el: 'div', cls: 'closePopup material-icons', elTxt: 'highlight_off' };
        ndConfig.popupBody = { el: 'div', cls: 'popupBody' };

        // user defines node
        if (this.id != null) {
            ndConfig.popup.id = this.id;
        }

        if (this.headingTxt != null) {
            ndConfig.heading.elTxt = this.headingTxt;
        }

        if (this.body != null) {
            ndConfig.popupBody.innerHtml = this.body;
        }

        if (this.footer != null) {
            ndConfig.footer = { el: 'div', cls: 'popupFooter' };
            ndConfig.footer.innerHtml = this.footer;
        }


        let nodes = this.createQueueEl(ndConfig);

        nodes.popupHeader.append(nodes.heading, nodes.closePopup);
        nodes.innerPopup.append(nodes.popupHeader, nodes.popupBody);
        nodes.popupLayer.appendChild(nodes.innerPopup);
        nodes.popup.appendChild(nodes.popupLayer);
        return nodes;
    }

    // Create main queue ancher nodes
    createQueueEl(nodesObj) {
        let nodes = {};
        // create nodes
        for (const nodeConfig in nodesObj) {
            nodes[nodeConfig] = this.createNode(nodesObj[nodeConfig]);
        }
        return nodes;
    }

    // create element with specific configration
    createNode({ el = null, cls = null, elTxt = null, src = null, href = null, datasetType = null, datasetValue = null, innerHtml = null, id = null }) {
        const node = document.createElement(el)

        // add tag in node
        if (cls != null) {
            node.className += cls;
        }

        // add id in node
        if (id != null) {
            node.id += id;
        }

        // add textContent in node
        if (elTxt != null) {
            node.textContent = elTxt;
        }

        // add source file in ancher node
        if (src != null) {
            node.src = src;
        }

        // add href file in ancher node
        if (href != null) {
            node.href = href;
        }

        // add dataSet and value in node
        if (datasetType != null && datasetValue) {
            node.dataset[datasetType] = datasetValue;
        }

        // add dataSet and value in node
        if (datasetType != null && datasetValue) {
            node.dataset[datasetType] = datasetValue;
        }

        // add innerHTML content
        if (innerHtml != null) {
            node.innerHTML = innerHtml;
        }

        return node;
    }
}

export default PopupJs;