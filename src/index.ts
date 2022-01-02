
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

interface WhenTag extends HTMLElement {

}

interface CaseTag extends HTMLElement {

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
                    thenTags.forEach(tag => tag.style.display = "contents");
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
                        elifTag.style.display = "contents";
                        return;
                    }
                }

                elseTags.forEach(thenTag => thenTag.style.display = "contents");

            });

            const whenTags = Array.from(stateful.getElementsByTagName("when")) as WhenTag[];
            whenTags.forEach(whenTag => {

                const value = state[whenTag.getAttribute("value") as string];
                const cases = Array.from(whenTag.getElementsByTagName("case")) as CaseTag[];

                let found = false;
                for (const caseTag of cases) {

                    const caseValueName = caseTag.getAttribute("value");
                    if (!caseValueName) {
                        caseTag.style.display = "none";
                        continue;
                    }

                    let caseValue: string | number = caseValueName.substring(1);
                    if (caseValueName.startsWith("!")) { // literal value
                        if (!isNaN(+caseValue) && typeof value === "number") {
                            caseValue = +caseValue;
                        }
                    } else {
                        caseValue = state[caseValueName];
                    }

                    if (!found && typeof value !== "undefined" && caseValue === value) {
                        caseTag.style.display = "contents";
                        found = true;
                    } else {
                        caseTag.style.display = "none";
                    }

                }

                (Array.from(whenTag.getElementsByTagName("else")) as ElseTag[]).forEach(elseTag => {
                    elseTag.style.display = found ? "none" : "contents";
                });

            });

        };

        render();

    });

})();
