import BaseDOM from "./base-dom"
import DOMActions from "../action/dom-actions"
import {
    createContainerByTagName,
    createCommonContainer,
    createCardIcons,
    createCardInfoNodes,
    handleNodeToggle
} from "./dom-util"

export default class CardBox extends BaseDOM {

    constructor(card) {
        super(createContainerByTagName("section"));
        this.containerDOM.className = "card";

        this.card = card;
        this.domActions = new DOMActions(this.card.id);


        this.childrenNode = {
            avatarNode: this.buildAvatarNode(),
            infoNode: this.buildInfoNode(),
            actionNode: this.buildActionNode(),
            toggleNode: this.buildToggleNode()
        }

    }

    render() {
        let {avatarNode, infoNode, actionNode, toggleNode} = this.childrenNode;
        this.containerDOM.appendChild(avatarNode);
        this.containerDOM.appendChild(infoNode);
        this.containerDOM.appendChild(actionNode);
        this.containerDOM.appendChild(toggleNode);

        this.containerDOM.addEventListener("click", () => {
            this.containerDOM.style.backgroundColor = "#f4f2f2";
            actionNode.style.display = "initial";

            //outsite card click
            document.body.addEventListener("click", (e) => this.storeInformation(e));
        });

        return this.containerDOM;
    }

    buildAvatarNode() {
        let avaContainer = createCommonContainer("avatar");

        let avatar = document.createElement("img");
        avatar.src = `images/${this.card.userCardInfo.getAvatar()}`;
        avaContainer.appendChild(avatar);

        return avaContainer;
    }

    buildInfoNode() {
        let infoNode = createContainerByTagName("ul");
        let {usernameDOM, departmentDOM, employeeIdDOM, prefix} = createCardInfoNodes(this.card.userCardInfo.getUsername(),
            this.card.userCardInfo.getDepartment(), this.card.userCardInfo.getEmployeeId());

        infoNode.className = "info";
        infoNode.appendChild(usernameDOM);
        infoNode.appendChild(departmentDOM);
        infoNode.appendChild(employeeIdDOM);
        infoNode.appendChild(prefix);

        return infoNode;
    }

    buildActionNode() {
        let actionNode = createCommonContainer("action");
        let {editIcon, createPeerCardIcon, createSubCardIcon, deleteIcon} = createCardIcons();

        editIcon.addEventListener("click", () => this.domActions.editCardInfo(this.childrenNode.infoNode));
        createPeerCardIcon.addEventListener("click", () => this.domActions.addPeerCard());
        createSubCardIcon.addEventListener("click", () => this.domActions.addSubCard(this.card.getSubCards().length > 0));
        deleteIcon.addEventListener("click", () => {
            let confirm = window.confirm("Are your sure to delete this card ?");
            if (confirm === true) {
                this.domActions.deleteCard();
            }
        });

        actionNode.appendChild(editIcon);
        actionNode.appendChild(createSubCardIcon);

        if (this.card.parent !== undefined) {
            actionNode.appendChild(createPeerCardIcon);
            actionNode.appendChild(deleteIcon);
        }

        return actionNode;
    }

    buildToggleNode() {
        let toggleNode = createCommonContainer("toggle");
        let {plusIcon, minusIcon} = createCardIcons();

        minusIcon.addEventListener("click", () => handleNodeToggle(this.containerDOM.parentNode, minusIcon, plusIcon, false));
        plusIcon.addEventListener("click", () => handleNodeToggle(this.containerDOM.parentNode, minusIcon, plusIcon));
        this.card.getSubCards().length === 0 ? minusIcon.style.display = "none" : plusIcon.style.display = "none";

        toggleNode.appendChild(plusIcon);
        toggleNode.appendChild(minusIcon);
        return toggleNode;
    }

    storeInformation(e) {
        let {infoNode, actionNode, toggleNode} = this.childrenNode;

        if (toggleNode.contains(e.target) || !this.containerDOM.contains(e.target)) {
            this.containerDOM.style.backgroundColor = "white";
            actionNode.style.display = "none";

            Array.from(infoNode.childNodes)
                .forEach(node => {
                    if (node === infoNode.lastChild) {
                        return;
                    }
                    let { firstChild, lastChild } = node;

                    firstChild.style.display = "initial";
                    lastChild.style.display = "none";
                    firstChild.innerHTML = lastChild.value;
                })
        }
    }
}