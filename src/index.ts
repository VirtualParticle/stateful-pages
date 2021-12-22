
interface State {
    [propName: string]: any
}

interface StatefulTag extends HTMLElement {
    setState: (obj: State) => void,
    state: State,
}

interface ValueTag extends HTMLElement {

}

interface IfTag extends HTMLElement {

}

interface ThenTag extends HTMLElement {

}

interface ElifTag extends IfTag {

}

interface ElseTag extends HTMLElement {

}

(() => {

    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const statefulTags = Array.from(document.getElementsByTagName("stateful")) as StatefulTag[];
    statefulTags.forEach(stateful => {

        const state: State = {};
        const valueTags = Array.from(stateful.getElementsByTagName("value")) as ValueTag[];

        stateful.setState = (obj: State) => {

            for (const key of Object.keys(obj)) {

                let value = obj[key];
                if (typeof value === "string") {
                    value = escapeHtml(value);
                } else {
                    value = value?.outerHTML ?? value;
                }

                state[key] = value;
                const values = valueTags.filter(tag => tag.getAttribute("name") === key);
                values.forEach(tag => tag.innerHTML = value);

            }

            render();

        };

        const render = () => {

            stateful.state = state;

            const ifTags = Array.from(stateful.getElementsByTagName("if")) as IfTag[];
            ifTags.forEach(ifTag => {

                const condition = !!state[ifTag.getAttribute("condition") as string];

                const thenTags = Array.from(ifTag.getElementsByTagName("then")) as ThenTag[];
                const elifTags = Array.from(ifTag.getElementsByTagName("elif")) as ElifTag[];
                const elseTags = Array.from(ifTag.getElementsByTagName("else")) as ElseTag[];

                if (condition) {
                    thenTags.forEach(tag => tag.style.display = "inline");
                    elifTags.forEach(tag => tag.style.display = "none");
                    elseTags.forEach(tag => tag.style.display = "none");
                    return;
                }

                thenTags.forEach(tag => tag.style.display = "none");
                elifTags.forEach(tag => tag.style.display = "none");
                elseTags.forEach(tag => tag.style.display = "none");

                for (const elifTag of elifTags) {
                    const condition = !!state[elifTag.getAttribute("condition") as string];
                    if (condition) {
                        elifTag.style.display = "inline";
                        return;
                    }
                }

                elseTags.forEach(thenTag => thenTag.style.display = "inline");

            });

        };

        render();

    });

})();
