class PopupJs {
    constructor({ id = null, headingTxt = null, body = null, footer = null }) {
        this.popupEl = null;
        this.init(id, headingTxt, body, footer);
    }

    init(id, headingTxt, body, footer) {
        let popupNodes = this.getPopup(id, headingTxt, body, footer);
        
        // event Listener
        this.eventListener(popupNodes);

        // append in body
        document.body.prepend(popupNodes.popup);
        this.popupEl = popupNodes.popup;
    }

    eventListener(popupNodes) {
        console.log(popupNodes.closePopup);
        popupNodes.closePopup.addEventListener('click', (event) => this.closePopup(event))
    }

    closePopup() {
        document.body.classList.remove('activePopup');
        this.popupEl.classList.remove('opened');
        console.log('clickkkkkk');
    }

    getPopup(id, headingTxt, body, footer) {
        // default nodes
        let ndConfig = {};
        ndConfig.popup = { el: 'div', cls: 'popup' };
        ndConfig.innerPopup = { el: 'div', cls: 'innerPopup' };
        ndConfig.popupHeader = { el: 'div', cls: 'popupHeader' };
        ndConfig.heading = { el: 'div', cls: 'heading', elTxt: "Heading" };
        ndConfig.closePopup = { el: 'div', cls: 'closePopup material-icons', elTxt: 'highlight_off' };
        ndConfig.popupBody = { el: 'div', cls: 'popupBody' };

        // user defines node
        if (id != null) {
            ndConfig.popup.id = id;
        }

        if (headingTxt != null) {
            ndConfig.heading.elTxt = headingTxt;
        }

        if (body != null) {
            ndConfig.popupBody.innerHtml = body;
        }

        if (footer != null) {
            ndConfig.footer = { el: 'div', cls: 'popupFooter' };
            ndConfig.footer.innerHtml = footer;
        }


        let nodes = this.createQueueEl(ndConfig);

        nodes.popupHeader.append(nodes.heading, nodes.closePopup);
        nodes.innerPopup.append(nodes.popupHeader, nodes.popupBody);
        nodes.popup.appendChild(nodes.innerPopup);
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