import './styles.scss';

class CoffeeControlPanel extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Create a wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'panel');

        // Add a title
        const title = document.createElement('h3');
        title.textContent = `Welcome to ${this.getAttribute(
            'location'
        )} Coffee Station!`;

        // Add a start button
        const button = document.createElement('button');
        button.textContent = 'Brew Coffee';
        button.addEventListener('click', () => {
            console.log(
                `Brewing coffee at ${this.getAttribute('location')}...`
            );
        });

        const style = document.createElement('style');
        style.textContent = `
            .panel {
                margin-top: 3rem;
                max-width: 31.25rem;
                margin-inline: auto;
                border: 1px solid #ccc;
                padding: 2rem;
                border-radius: 0.5rem;
            }

            button {
                background-color: ${this.getAttribute('color')};
                color: white;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
            }

            h3 {
                color: #fff;
            }
            `;
        shadow.appendChild(style);

        // Append elements to the shadow DOM
        wrapper.appendChild(title);
        wrapper.appendChild(button);
        shadow.appendChild(wrapper);
    }
}
customElements.define('coffee-control-panel', CoffeeControlPanel);
